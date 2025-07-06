import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/connect-db"
import transactionModel from "@/models/transaction"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  try {
    const body = await req.json();
    const updatedTransaction = await transactionModel.findByIdAndUpdate(params.id, body, { new: true })
    if (!updatedTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }
    return NextResponse.json(updatedTransaction)
  } catch {
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  try {
    const deleted = await transactionModel.findByIdAndDelete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Transaction deleted" })
  } catch {
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 })
  }
}