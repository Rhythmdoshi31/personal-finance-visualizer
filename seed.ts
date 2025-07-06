// seed.ts
import mongoose from "mongoose"
import dotenv from "dotenv"
import transactionModel from "@/models/transaction"
import budgetModel from "@/models/budget"

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI!

const transactions = [
  // Jan
  { description: "Groceries", amount: 1100, category: "Food", date: "2025-01-04" },
  { description: "Uber ride", amount: 500, category: "Travel", date: "2025-01-06" },
  { description: "Netflix", amount: 499, category: "Entertainment", date: "2025-01-09" },
  { description: "Shoes", amount: 2100, category: "Shopping", date: "2025-01-12" },
  { description: "Clinic Visit", amount: 700, category: "Health", date: "2025-01-17" },

  // Feb
  { description: "Snacks", amount: 350, category: "Food", date: "2025-02-02" },
  { description: "Bus to Delhi", amount: 950, category: "Travel", date: "2025-02-05" },
  { description: "Spotify", amount: 129, category: "Entertainment", date: "2025-02-09" },
  { description: "Jacket", amount: 2800, category: "Shopping", date: "2025-02-14" },
  { description: "Vitamins", amount: 450, category: "Health", date: "2025-02-21" },

  // March
  { description: "Vegetables", amount: 800, category: "Food", date: "2025-03-03" },
  { description: "Cab", amount: 650, category: "Travel", date: "2025-03-07" },
  { description: "Movie", amount: 400, category: "Entertainment", date: "2025-03-11" },
  { description: "Amazon Order", amount: 1900, category: "Shopping", date: "2025-03-15" },
  { description: "Dental Checkup", amount: 900, category: "Health", date: "2025-03-18" },

  // April
  { description: "Daily groceries", amount: 950, category: "Food", date: "2025-04-01" },
  { description: "Weekend trip", amount: 1800, category: "Travel", date: "2025-04-05" },
  { description: "Hotstar", amount: 299, category: "Entertainment", date: "2025-04-09" },
  { description: "T-shirt", amount: 1200, category: "Shopping", date: "2025-04-11" },
  { description: "Hospital", amount: 1100, category: "Health", date: "2025-04-17" },

  // May
  { description: "Lunch outing", amount: 700, category: "Food", date: "2025-05-03" },
  { description: "Goa flight", amount: 3000, category: "Travel", date: "2025-05-06" },
  { description: "YouTube Premium", amount: 139, category: "Entertainment", date: "2025-05-08" },
  { description: "Pants", amount: 1700, category: "Shopping", date: "2025-05-14" },
  { description: "Medical test", amount: 600, category: "Health", date: "2025-05-19" },

  // June
  { description: "Groceries", amount: 1000, category: "Food", date: "2025-06-04" },
  { description: "Train trip", amount: 900, category: "Travel", date: "2025-06-06" },
  { description: "Concert", amount: 799, category: "Entertainment", date: "2025-06-12" },
  { description: "Shoes", amount: 2100, category: "Shopping", date: "2025-06-17" },
  { description: "Health insurance", amount: 2000, category: "Health", date: "2025-06-22" },

  // July
  { description: "Monthly groceries", amount: 1250, category: "Food", date: "2025-07-01" },
  { description: "Weekend trip", amount: 1200, category: "Travel", date: "2025-07-03" },
  { description: "Cinema", amount: 450, category: "Entertainment", date: "2025-07-07" },
  { description: "Flipkart Order", amount: 1850, category: "Shopping", date: "2025-07-10" },
  { description: "Clinic visit", amount: 850, category: "Health", date: "2025-07-15" },
]

const months = [1, 2, 3, 4, 5, 6, 7]

const budgets = months.flatMap((month) => {
  const year = 2025
  return [
    { category: "Food", amount: 3000, month, year },
    { category: "Travel", amount: 2500, month, year },
    { category: "Entertainment", amount: 1500, month, year },
    { category: "Shopping", amount: 4000, month, year },
    { category: "Health", amount: 2000, month, year },
    { category: "Bills", amount: 3500, month, year },
    { category: "Others", amount: 1000, month, year },
  ]
})

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB")

    await transactionModel.deleteMany()
    await budgetModel.deleteMany()

    await transactionModel.insertMany(transactions)
    await budgetModel.insertMany(budgets)

    console.log("✅ Dummy data inserted successfully!")
    process.exit(0)
  } catch (err) {
    console.error("❌ Seed error:", err)
    process.exit(1)
  }
}

seed()
