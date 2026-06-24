import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    const body = await req.json();
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json',
      'x-api-key': process.env.INTERNAL_API_KEY as string
    };
    
    if (userId) {
      headers["x-user-id"] = userId;
    }

    const res = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to connect to backend" }, { status: 500 });
  }
}
