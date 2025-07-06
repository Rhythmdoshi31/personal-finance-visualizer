import { connectDB } from "@/lib/connect-db";
import transactionModel from "@/models/transaction";
import { NextResponse } from "next/server";

// Gives the breakdown of spending by category for the current month.

export async function GET() {
  await connectDB();
  try {
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
    const startOfNextMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));

    const txns = await transactionModel.find({
      date: { $gte: startOfMonth, $lt: startOfNextMonth },
    });

    const categories: Record<string, number> = {};
    txns.forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch category breakdown" }, { status: 500 });
  }
}
