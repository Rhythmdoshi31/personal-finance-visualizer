import mongoose, { Schema } from "mongoose"
import { z } from "zod"

export const transactionSchemaZ = z.object({
  amount: z.number().positive(),
  description: z.string().trim().min(1),
  date: z.coerce.date().optional(), // if omitted, defaults later
  category: z.enum([
    "Food",
    "Travel",
    "Entertainment",
    "Shopping",
    "Health",
    "Bills",
    "Others",
  ]),
})

// TypeScript type for later use
export type TransactionType = z.infer<typeof transactionSchemaZ>

const transactionSchema = new Schema(
  {
    amount: { type: Number, required: true },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
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
  },
  { timestamps: true }
)

const transactionModel = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema)

export default transactionModel
