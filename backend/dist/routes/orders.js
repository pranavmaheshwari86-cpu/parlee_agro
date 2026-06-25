"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const order_1 = require("../lib/validations/order");
const zod_1 = require("zod");
const ratelimit_1 = require("../lib/ratelimit");
const router = (0, express_1.Router)();
// Create new order
router.post("/", async (req, res) => {
    try {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
        const { success } = (0, ratelimit_1.rateLimit)(ip, { maxRequests: 5, windowMs: 60000 });
        if (!success) {
            return res.status(429).json({ error: "Too many requests" });
        }
        const parsedData = order_1.createOrderSchema.parse(req.body);
        const { name, mobileNumber, alternateMobile, email, country, state, city, address, landmark, zipCode, items, idempotencyKey, paymentMethod } = parsedData;
        // Get userId from secure header passed by Next.js frontend proxy
        const userId = req.header("x-user-id");
        if (idempotencyKey) {
            const existingOrder = await prisma_1.prisma.order.findFirst({
                where: { idempotencyKey },
                include: { items: true },
            });
            if (existingOrder) {
                return res.status(200).json({ success: true, order: existingOrder });
            }
        }
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            let calculatedSubtotal = 0;
            const orderItemsToCreate = [];
            const productIds = items.map(i => i.productId);
            const products = await tx.product.findMany({
                where: { id: { in: productIds } },
                include: { inventory: true },
            });
            const productMap = new Map(products.map((p) => [p.id, p]));
            for (const item of items) {
                let product = productMap.get(item.productId);
                if (!product) {
                    product = await tx.product.create({
                        data: {
                            id: item.productId,
                            name: item.name,
                            price: item.price,
                            isActive: true,
                            inventory: {
                                create: {
                                    quantity: 1000,
                                    reserved: 0
                                }
                            }
                        },
                        include: { inventory: true }
                    });
                    productMap.set(item.productId, product);
                }
                else if (!product.isActive) {
                    throw new Error(`PRODUCT_UNAVAILABLE:${item.productId}`);
                }
                const inventory = product.inventory;
                if (!inventory) {
                    throw new Error(`INVENTORY_MISSING:${item.productId}`);
                }
                const availableStock = inventory.quantity - inventory.reserved;
                if (availableStock < item.quantity) {
                    throw new Error(`INSUFFICIENT_STOCK:${product.id}`);
                }
                const updatedInventory = await tx.inventory.updateMany({
                    where: { productId: product.id },
                    data: { reserved: { increment: item.quantity } },
                });
                if (updatedInventory.count === 0) {
                    throw new Error(`STOCK_RESERVATION_FAILED:${product.id}`);
                }
                const itemTotal = product.price * item.quantity;
                calculatedSubtotal += itemTotal;
                orderItemsToCreate.push({
                    productId: product.id,
                    productName: product.name,
                    quantity: item.quantity,
                    price: product.price,
                });
            }
            const shippingCharges = calculatedSubtotal > 500 ? 0 : 50; // Example shipping logic
            const tax = calculatedSubtotal * 0.18; // Example 18% tax
            const discount = 0; // Handle coupons if implemented
            const grandTotal = calculatedSubtotal + shippingCharges + tax - discount;
            const order = await tx.order.create({
                data: {
                    idempotencyKey: idempotencyKey || null,
                    userId: userId || null,
                    name,
                    mobileNumber,
                    alternateMobile,
                    email: email || "",
                    country: country || "",
                    state: state || "",
                    city,
                    address,
                    landmark,
                    zipCode,
                    subtotal: calculatedSubtotal,
                    shippingCharges,
                    tax,
                    discount,
                    grandTotal,
                    status: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
                    items: {
                        create: orderItemsToCreate,
                    },
                },
                include: {
                    items: true,
                },
            });
            return order;
        });
        return res.status(201).json({ success: true, order: result });
    }
    catch (error) {
        console.error("Order creation error:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: "Validation failed", details: error.flatten() });
        }
        if (error instanceof Error && error.message.includes("INSUFFICIENT_STOCK")) {
            return res.status(409).json({ error: "One or more items are out of stock" });
        }
        if (error instanceof Error && error.message.includes("PRODUCT_UNAVAILABLE")) {
            return res.status(400).json({ error: "One or more items are unavailable" });
        }
        return res.status(500).json({ error: "Failed to process checkout" });
    }
});
// Admin: View all orders
router.get("/", async (req, res) => {
    try {
        const { status, search } = req.query;
        const whereClause = {};
        if (status) {
            whereClause.status = String(status);
        }
        if (search) {
            whereClause.OR = [
                { name: { contains: String(search), mode: "insensitive" } },
                { email: { contains: String(search), mode: "insensitive" } },
                { id: { contains: String(search), mode: "insensitive" } }
            ];
        }
        const orders = await prisma_1.prisma.order.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            include: {
                items: true,
                payments: true
            }
        });
        return res.status(200).json({ success: true, orders });
    }
    catch (error) {
        console.error("Fetch orders error:", error);
        return res.status(500).json({ error: "Failed to fetch orders" });
    }
});
// Admin: View specific order
router.get("/:id", async (req, res) => {
    try {
        const id = String(req.params.id);
        const order = await prisma_1.prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
                payments: true,
                user: { select: { id: true, name: true, email: true } }
            }
        });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        return res.status(200).json({ success: true, order });
    }
    catch (error) {
        console.error("Fetch order error:", error);
        return res.status(500).json({ error: "Failed to fetch order" });
    }
});
// Admin: Update order status
router.put("/:id/status", async (req, res) => {
    try {
        const id = String(req.params.id);
        const { status } = req.body;
        const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "REFUNDED"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }
        const order = await prisma_1.prisma.order.update({
            where: { id },
            data: { status },
            include: { items: true }
        });
        return res.status(200).json({ success: true, order });
    }
    catch (error) {
        console.error("Update order error:", error);
        return res.status(500).json({ error: "Failed to update order status" });
    }
});
exports.default = router;
