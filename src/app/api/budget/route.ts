import { connectDB } from "@/lib/connect-db"
import { NextResponse } from "next/server"
import { budgetSchemaZ } from "@/models/budget"
import budgetModel from "@/models/budget"

export async function GET() {
  await connectDB();
  try {
    const budgets = await budgetModel.find();
    return NextResponse.json(budgets);
  } catch {
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();
  const body = await request.json();
  const parsed = budgetSchemaZ.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
  try {
    const budget = await budgetModel.create(parsed.data);
    return NextResponse.json(budget);
  } catch {
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 });
  }
}
