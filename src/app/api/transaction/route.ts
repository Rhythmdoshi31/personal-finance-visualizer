import { connectDB } from "@/lib/connect-db";
import { NextResponse } from "next/server";
import { transactionSchemaZ } from "@/models/transaction";
import transactionModel from "@/models/transaction";

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const parsed = transactionSchemaZ.safeParse(body);

    if (!parsed.success) {
      console.log("Validation error:", parsed.error);
      return NextResponse.json({ 
        error: "Validation failed", 
        details: parsed.error.errors 
      }, { status: 400 });
    }

    const transaction = await transactionModel.create({
      amount: parsed.data.amount,
      description: parsed.data.description,
      category: parsed.data.category,
      date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Failed to create transaction" },
        { status: 500 }
      );
    }
    return NextResponse.json(transaction);
    
  } catch {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();
  try {
    const transactions = await transactionModel
      .find()
      .select('amount description date category')
      .sort({ date: -1 })
      .limit(12);
    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
