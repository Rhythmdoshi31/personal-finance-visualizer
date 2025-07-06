"use client"

import * as React from "react"
import { Dashboard } from "@/components/dashboard"
import { Transactions } from "@/components/transactions"
import { Budgets } from "@/components/budgets"
import { useNavigation } from "@/contexts/navigation-context"

export default function Home() {
  const { currentPage } = useNavigation()

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "transactions":
        return <Transactions />
      case "budgets":
        return <Budgets />
      default:
        return <Dashboard />
    }
  }

  return (
    <div>
      {renderPage()}
    </div>
  )
}
