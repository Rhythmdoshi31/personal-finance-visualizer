import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/connect-db"
import budgetModel from "@/models/budget"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB()
  try {
    const body = await req.json()
    const updatedBudget = await budgetModel.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    )
    if (!updatedBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }
    return NextResponse.json(updatedBudget)
  } catch {
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB()
  try {
    const deleted = await budgetModel.findByIdAndDelete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Budget deleted" })
  } catch {
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 })
  }
}
