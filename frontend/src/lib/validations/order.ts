import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
  price: z.number().nonnegative("Price must be non-negative"),
});

export const createOrderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  zipCode: z.string().min(4, "Invalid ZIP code"),
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
  idempotencyKey: z.string().optional(),
  paymentMethod: z.enum(["COD", "ONLINE"]).optional(),
});

export const createPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  currency: z.string().length(3, "Currency must be 3 characters").default("INR"),
  // Amount is calculated server-side now to prevent spoofing, so we don't strictly require it from client for processing
  // but we can accept it for validation mismatch checks if we want.
});


