import { NextResponse } from "next/server"
import { connectDB } from "@/lib/connect-db"
import transactionModel from "@/models/transaction"

// Gives the total spent and total income for the current month.

export async function GET() {
  await connectDB();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  try {
    const transactions = await transactionModel.find({
      date: { $gte: new Date(`${currentMonth}-01`), $lt: new Date(`${currentMonth}-31`) },
    });

    const totalSpent = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    const totalIncome = 10000; // Can later be fetched from an Income model
    const percentageSpent = totalSpent / totalIncome * 100;

    return NextResponse.json({ month: currentMonth, totalSpent, totalIncome, percentageSpent });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch monthly summary" }, { status: 500 });
  }
}
