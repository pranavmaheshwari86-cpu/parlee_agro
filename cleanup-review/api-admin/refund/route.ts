import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { refundPaymentSchema } from "../schemas";
import { z } from "zod";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const parsedData = refundPaymentSchema.parse(body);
    const { paymentDbId, amount } = parsedData;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentDbId }
    });

    if (!payment || !payment.paymentId) {
      return NextResponse.json({ error: "Payment not found or not captured" }, { status: 404 });
    }

    if (payment.status !== "PAID" && payment.status !== "PARTIAL_REFUND") {
      return NextResponse.json({ error: "Payment is not in a refundable state" }, { status: 400 });
    }

    // Call Razorpay Refund API
    const refundOptions: any = {};
    if (amount) {
      refundOptions.amount = Math.round(amount * 100); // paise
    }

    const refund = await razorpay.payments.refund(payment.paymentId, refundOptions);

    if (!refund) {
      return NextResponse.json({ error: "Refund failed at gateway" }, { status: 500 });
    }

    // We don't necessarily update the DB status here fully if we rely on webhooks,
    // but we can mark it as processing or rely on the `refund.processed` webhook.
    // For immediate UI feedback, we can optimistically update it.
    
    return NextResponse.json({ success: true, refund }, { status: 200 });
  } catch (error) {
    console.error("Refund error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
