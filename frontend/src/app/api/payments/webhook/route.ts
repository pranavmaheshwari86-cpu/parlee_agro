import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (signature) headers["x-razorpay-signature"] = signature;

    const res = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/webhook`, {
      method: 'POST',
      headers,
      body: rawBody
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 500 });
  }
}
