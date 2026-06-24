"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const order_1 = require("../lib/validations/order");
const zod_1 = require("zod");
const ratelimit_1 = require("../lib/ratelimit");
const router = (0, express_1.Router)();
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
router.post("/create-order", async (req, res) => {
    try {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
        const { success } = (0, ratelimit_1.rateLimit)(ip, { maxRequests: 10, windowMs: 60000 });
        if (!success) {
            return res.status(429).json({ error: "Too many requests" });
        }
        const parsedData = order_1.createPaymentSchema.parse(req.body);
        const { orderId, currency } = parsedData;
        const userId = req.header("x-user-id");
        const order = await prisma_1.prisma.order.findUnique({
            where: { id: orderId },
            include: { payments: true }
        });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        if (order.userId && order.userId !== userId) {
            return res.status(403).json({ error: "Unauthorized access to order" });
        }
        if (order.status === "PAID") {
            return res.status(400).json({ error: "Order is already paid" });
        }
        const actualAmount = order.grandTotal;
        const options = {
            amount: Math.round(actualAmount * 100),
            currency,
            receipt: `receipt_order_${orderId}`,
        };
        const razorpayOrder = await razorpay.orders.create(options);
        if (!razorpayOrder) {
            return res.status(500).json({ error: "Failed to create Razorpay order" });
        }
        const payment = await prisma_1.prisma.payment.create({
            data: {
                orderId: order.id,
                userId: userId || null,
                amount: actualAmount,
                currency: currency,
                razorpayOrderId: razorpayOrder.id,
                status: "PENDING",
            },
        });
        return res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            paymentDbId: payment.id,
        });
    }
    catch (error) {
        console.error("Razorpay create-order error:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: "Validation failed", details: error.flatten() });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});
router.post("/verify", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentDbId, } = req.body;
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            console.error("Razorpay key secret not configured.");
            return res.status(500).json({ error: "Server configuration error" });
        }
        const generatedSignature = crypto_1.default
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");
        const isValid = crypto_1.default.timingSafeEqual(Buffer.from(generatedSignature), Buffer.from(razorpay_signature));
        if (!isValid) {
            await prisma_1.prisma.payment.update({
                where: { id: paymentDbId },
                data: { status: "FAILED" },
            });
            return res.status(400).json({ error: "Invalid payment signature" });
        }
        const updatedPayment = await prisma_1.prisma.payment.update({
            where: { id: paymentDbId },
            data: {
                status: "PAID",
                paymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
            },
            include: { order: true },
        });
        if (updatedPayment.orderId) {
            await prisma_1.prisma.order.update({
                where: { id: updatedPayment.orderId },
                data: { status: "PAID" },
            });
        }
        return res.status(200).json({ success: true, payment: updatedPayment });
    }
    catch (error) {
        console.error("Razorpay verify error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
// We mounted express.raw() in index.ts for /api/payments/webhook
router.post("/webhook", async (req, res) => {
    try {
        // req.body is a Buffer here because of express.raw()
        const rawBody = req.body.toString("utf8");
        const signature = req.header("x-razorpay-signature");
        if (!signature) {
            return res.status(400).json({ error: "Missing webhook signature" });
        }
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("Webhook secret not configured.");
            return res.status(500).json({ error: "Server configuration error" });
        }
        const expectedSignature = crypto_1.default
            .createHmac("sha256", webhookSecret)
            .update(rawBody)
            .digest("hex");
        if (expectedSignature !== signature) {
            return res.status(400).json({ error: "Invalid webhook signature" });
        }
        const event = JSON.parse(rawBody);
        const eventType = event.event;
        let razorpayOrderId = null;
        let razorpayPaymentId = null;
        if (event.payload?.payment?.entity) {
            razorpayOrderId = event.payload.payment.entity.order_id;
            razorpayPaymentId = event.payload.payment.entity.id;
        }
        else if (event.payload?.refund?.entity) {
            razorpayPaymentId = event.payload.refund.entity.payment_id;
        }
        let payment = null;
        if (razorpayOrderId) {
            payment = await prisma_1.prisma.payment.findUnique({ where: { razorpayOrderId } });
        }
        else if (razorpayPaymentId) {
            payment = await prisma_1.prisma.payment.findFirst({ where: { paymentId: razorpayPaymentId } });
        }
        if (!payment) {
            console.warn("Webhook received for unknown payment:", eventType);
            return res.status(200).json({ success: true, message: "Payment not found in DB, ignoring." });
        }
        const existingEvent = await prisma_1.prisma.paymentEvent.findFirst({
            where: {
                paymentId: payment.id,
                eventType: eventType,
                processed: true
            }
        });
        if (existingEvent) {
            return res.status(200).json({ success: true, message: "Event already processed" });
        }
        const paymentEvent = await prisma_1.prisma.paymentEvent.create({
            data: {
                paymentId: payment.id,
                eventType: eventType,
                rawPayload: rawBody,
            }
        });
        try {
            if (eventType === "payment.captured" || eventType === "payment.authorized") {
                if (payment.status !== "PAID") {
                    await prisma_1.prisma.payment.update({
                        where: { id: payment.id },
                        data: {
                            status: "PAID",
                            paymentId: razorpayPaymentId,
                        },
                    });
                    await prisma_1.prisma.order.update({
                        where: { id: payment.orderId },
                        data: { status: "PAID" },
                    });
                }
            }
            else if (eventType === "payment.failed") {
                if (payment.status !== "FAILED") {
                    const order = await prisma_1.prisma.order.findUnique({
                        where: { id: payment.orderId },
                        include: { items: true }
                    });
                    if (order && order.status !== "FAILED") {
                        await prisma_1.prisma.payment.update({
                            where: { id: payment.id },
                            data: { status: "FAILED" },
                        });
                        await prisma_1.prisma.order.update({
                            where: { id: payment.orderId },
                            data: { status: "FAILED" },
                        });
                        for (const item of order.items) {
                            await prisma_1.prisma.inventory.update({
                                where: { productId: item.productId },
                                data: {
                                    reserved: { decrement: item.quantity }
                                }
                            });
                        }
                    }
                }
            }
            else if (eventType === "refund.processed") {
                if (payment.refundStatus !== "FULL") {
                    const refundAmount = event.payload.refund.entity.amount / 100;
                    const newRefundStatus = refundAmount >= payment.amount ? "FULL" : "PARTIAL";
                    await prisma_1.prisma.payment.update({
                        where: { id: payment.id },
                        data: { refundStatus: newRefundStatus, status: newRefundStatus === "FULL" ? "REFUNDED" : payment.status },
                    });
                    if (newRefundStatus === "FULL") {
                        await prisma_1.prisma.order.update({
                            where: { id: payment.orderId },
                            data: { status: "REFUNDED" }
                        });
                    }
                }
            }
            await prisma_1.prisma.paymentEvent.update({
                where: { id: paymentEvent.id },
                data: { processed: true, processedAt: new Date() }
            });
        }
        catch (processError) {
            console.error("Failed to process webhook event:", processError);
            await prisma_1.prisma.paymentEvent.update({
                where: { id: paymentEvent.id },
                data: { error: processError instanceof Error ? processError.message : "Unknown error" }
            });
            throw processError;
        }
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error("Razorpay webhook error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
// Payments get by ID
router.get("/:id", async (req, res) => {
    try {
        const userId = req.header("x-user-id");
        const id = req.params.id;
        const payment = await prisma_1.prisma.payment.findUnique({
            where: { id },
            include: { order: true }
        });
        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        if (payment.userId && payment.userId !== userId) {
            return res.status(403).json({ error: "Unauthorized access" });
        }
        return res.status(200).json({ success: true, payment });
    }
    catch (error) {
        console.error("Payment fetch error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
// Get user payment history
router.get("/", async (req, res) => {
    try {
        const userId = req.header("x-user-id");
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const payments = await prisma_1.prisma.payment.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: { order: true },
        });
        return res.status(200).json({ success: true, payments });
    }
    catch (error) {
        console.error("Payment history fetch error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
