import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [totalRevenue, totalOrders, recentOrders, topProducts] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true }
      }),
      prisma.order.count(),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { items: true, payments: true }
      }),
      // Aggregate order items to find top products
      prisma.orderItem.groupBy({
        by: ['productId', 'productName'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      })
    ]);

    const stats = {
      revenue: totalRevenue._sum.amount || 0,
      orders: totalOrders,
      recentOrders,
      topProducts: topProducts.map(tp => ({
        id: tp.productId,
        name: tp.productName,
        sold: tp._sum.quantity
      }))
    };

    return NextResponse.json({ success: true, stats }, { status: 200 });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
