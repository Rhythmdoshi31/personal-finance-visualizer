import mongoose, { Schema } from "mongoose"
import { z } from "zod"

export const budgetSchemaZ = z.object({
  category: z.enum([
    "Food",
    "Travel",
    "Entertainment",
    "Shopping",
    "Health",
    "Bills",
    "Others",
  ]),
  amount: z.number().positive(),
  month: z.number().min(0).max(11),
  year: z.number().min(2000).max(2100),
})

// TypeScript type for inference
export type BudgetType = z.infer<typeof budgetSchemaZ>

const budgetSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Travel",
        "Entertainment",
        "Shopping",
        "Health",
        "Bills",
        "Others",
      ],
    },
    amount: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
)

const budgetModel = mongoose.models.Budget || mongoose.model("Budget", budgetSchema)
export default budgetModel
