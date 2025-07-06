import { connectDB } from "@/lib/connect-db";
import budgetModel from "@/models/budget";
import transactionModel from "@/models/transaction";
import { NextResponse } from "next/server";

// Gives the category, budget, and spent for each category for the current month.

export async function GET() {
  await connectDB();
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() is 0-based
    const currentYear = today.getFullYear();
    const budgets = await budgetModel.find({ month: currentMonth, year: currentYear });

    const txns = await transactionModel.find({
      date: {
        $gte: new Date(currentYear, currentMonth - 1, 1),
        $lt: new Date(currentYear, currentMonth, 1),
      },
    });

    const categorySpending: Record<string, number> = {};
    txns.forEach((t) => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

    const result = budgets.map((b) => {
      const spent = categorySpending[b.category] || 0;
      const percentage = b.amount > 0 ? (spent / b.amount) * 100 : 0;
      
      return {
        category: b.category,
        budget: b.amount,
        spent: spent,
        percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
        remaining: b.amount - spent,
        isOverBudget: spent > b.amount
      };
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to fetch budget status" }, { status: 500 });
  }
}
