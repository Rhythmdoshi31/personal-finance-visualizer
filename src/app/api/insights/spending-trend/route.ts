import { NextResponse } from "next/server"
import { subMonths } from "date-fns"
import { connectDB } from "@/lib/connect-db"
import transactionModel from "@/models/transaction"

// Gives the spending trend for the current month and the previous month.
// Gives the percentage change in spending between the two months along with the total spent for both months.

export async function GET() {
  await connectDB();
  try {
    const now = new Date();

    // Current month start and end
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Last month start and end
    const lastMonthDate = subMonths(now, 1);
    const startOfLastMonth = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth(), 1);

    const thisMonthTxns = await transactionModel.find({
      date: { $gte: startOfThisMonth, $lt: startOfNextMonth }
    });

    const lastMonthTxns = await transactionModel.find({
      date: { $gte: startOfLastMonth, $lt: startOfThisMonth }
    });

    const thisTotal = thisMonthTxns.reduce((sum, t) => sum + t.amount, 0);
    const lastTotal = lastMonthTxns.reduce((sum, t) => sum + t.amount, 0);

    const change = lastTotal === 0 ? 100 : ((thisTotal - lastTotal) / lastTotal) * 100;

    return NextResponse.json({
      thisMonth: startOfThisMonth.toISOString().slice(0, 7),
      thisTotal,
      lastMonth: startOfLastMonth.toISOString().slice(0, 7),
      lastTotal,
      change: Number(change.toFixed(2)) // rounded %
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch spending trend" }, { status: 500 });
  }
}
