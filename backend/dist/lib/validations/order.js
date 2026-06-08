"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const orderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, "Product ID is required"),
    name: zod_1.z.string().min(1, "Product name is required"),
    quantity: zod_1.z.number().int().positive("Quantity must be positive"),
    price: zod_1.z.number().nonnegative("Price must be non-negative"),
});
exports.createOrderSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    address: zod_1.z.string().min(5, "Address must be at least 5 characters"),
    zipCode: zod_1.z.string().min(4, "Invalid ZIP code"),
    items: zod_1.z.array(orderItemSchema).min(1, "Order must contain at least one item"),
    idempotencyKey: zod_1.z.string().optional(),
    paymentMethod: zod_1.z.enum(["COD", "ONLINE"]).optional(),
});
exports.createPaymentSchema = zod_1.z.object({
    orderId: zod_1.z.string().min(1, "Order ID is required"),
    currency: zod_1.z.string().length(3, "Currency must be 3 characters").default("INR"),
    // Amount is calculated server-side now to prevent spoofing, so we don't strictly require it from client for processing
    // but we can accept it for validation mismatch checks if we want.
});
