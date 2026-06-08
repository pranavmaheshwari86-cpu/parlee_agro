import { z } from "zod";

export const refundPaymentSchema = z.object({
  paymentDbId: z.string().min(1, "Payment DB ID is required"),
  amount: z.number().positive("Refund amount must be positive").optional(), // Optional means full refund
});
