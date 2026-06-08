import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { createOrderSchema } from "../lib/validations/order";
import { z } from "zod";
import { rateLimit } from "../lib/ratelimit";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const { success } = rateLimit(ip as string, { maxRequests: 5, windowMs: 60000 });
    if (!success) {
      return res.status(429).json({ error: "Too many requests" });
    }

    const parsedData = createOrderSchema.parse(req.body);
    const { name, email, address, zipCode, items, idempotencyKey, paymentMethod } = parsedData;

    // Get userId from secure header passed by Next.js frontend proxy
    const userId = req.header("x-user-id");

    if (idempotencyKey) {
      const existingOrder = await prisma.order.findUnique({
        where: { idempotencyKey },
        include: { items: true },
      });
      if (existingOrder) {
        return res.status(200).json({ success: true, order: existingOrder });
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      let calculatedSubtotal = 0;
      const orderItemsToCreate = [];

      const productIds = items.map(i => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        include: { inventory: true },
      });

      const productMap = new Map(products.map(p => [p.id, p]));

      for (const item of items) {
        const product = productMap.get(item.productId);

        if (!product || !product.isActive) {
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

      return await tx.order.create({
        data: {
          idempotencyKey: idempotencyKey || null,
          userId: userId || null,
          name,
          email,
          address,
          zipCode,
          subtotal: calculatedSubtotal,
          status: paymentMethod === "COD" ? "COD_CONFIRMED" : "PENDING",
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          items: true,
        },
      });
    }, {
      maxWait: 8000, 
      timeout: 15000,
    });

    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Order creation error:", error);
    if (error instanceof z.ZodError) {
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

export default router;
