import { NextResponse } from "next/server"
import { connectDB } from "@/lib/connect-db"
import transactionModel from "@/models/transaction"

export async function GET() {
  await connectDB();
  try {
    const txns = await transactionModel.find();

    const monthMap: Record<string, number> = {};

    txns.forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthMap[monthKey] = (monthMap[monthKey] || 0) + t.amount;
    });

    const sorted = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total }));

    return NextResponse.json(sorted);
  } catch {
    return NextResponse.json({ error: "Failed to fetch monthly breakdown" }, { status: 500 });
  }
}
