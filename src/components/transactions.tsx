"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip } from "@/components/ui/tooltip"
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PencilIcon, TrashIcon, SearchIcon, Plus, Filter, Download, Calendar, Wallet, TrendingUp, PieChartIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionSheet } from "@/components/transaction-sheet"
import { useSidebar } from "@/components/ui/sidebar"
import axios from "axios"

type Transaction = {
  _id: string
  description: string
  amount: number
  category: string
  date: string
}

type BudgetStatus = {
  category: string
  budget: number
  spent: number
}

export function Transactions() {
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [dateFilter, setDateFilter] = React.useState("all")
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [budgetStatus, setBudgetStatus] = React.useState<BudgetStatus[]>([])
  React.useEffect(() => {
    const fetchTransactions = async () => {
      const res = await axios.get("/api/transaction");
      const res2 = await axios.get("/api/insights/budget-status");
      setTransactions(res.data)
      setBudgetStatus(res2.data as BudgetStatus[])
    }
    fetchTransactions()
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filtering logic
    let matchesDate = true;
    if (dateFilter !== "all") {
      const transactionDate = new Date(transaction.date.split('/').reverse().join('-'));
      const now = new Date();
      
      switch (dateFilter) {
        case "today":
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          matchesDate = transactionDate >= today && transactionDate < tomorrow;
          break;
        case "week":
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 7);
          matchesDate = transactionDate >= startOfWeek && transactionDate < endOfWeek;
          break;
        case "month":
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          matchesDate = transactionDate >= startOfMonth && transactionDate < startOfNextMonth;
          break;
        case "year":
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1);
          matchesDate = transactionDate >= startOfYear && transactionDate < startOfNextYear;
          break;
      }
    }
    
    return matchesCategory && matchesSearch && matchesDate;
  });

  const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0); 

  const summaryCards = [
    {
      title: "Total Spent",
      amount: `$${totalSpent.toFixed(2)}`,
      badge: "This Month",
      badgeColor: "bg-secondary",
      tooltip: `Total spent across all the transactions this month`,
      icon: <Wallet className="w-6 h-6" />,
      gradientColor: "from-green-500/5",
      iconBgColor: "bg-green-500/10",
      iconColor: "text-green-600",
      dotColor: "bg-green-500/60",
      subtitle: `Across all the transactions this month`
    },
    {
      title: "Total Budget",
      amount: "$10,000.00",
      badge: "This Month",
      badgeColor: "bg-secondary",
      tooltip: "Total budget for this month",
      icon: <TrendingUp className="w-6 h-6" />,
      gradientColor: "from-blue-500/5",
      iconBgColor: "bg-blue-500/10",
      iconColor: "text-blue-600",
      dotColor: "bg-blue-500/60",
      subtitle: "Total budget this month"
    },
    {
      title: "Categories Used",
      amount: new Set(budgetStatus.filter((t: BudgetStatus) => t.spent > 0).map((t: BudgetStatus) => t.category)).size.toString(),
      badge: "Active",
      badgeColor: "bg-secondary",
      tooltip: "Number of different spending categories",
      icon: <PieChartIcon className="w-6 h-6" />,
      gradientColor: "from-purple-500/5",
      iconBgColor: "bg-purple-500/10",
      iconColor: "text-purple-600",
      dotColor: "bg-purple-500/60",
      subtitle: "Categories with spending this month"
    },
  ];

  const { state } = useSidebar()
  const isSidebarExpanded = state === "expanded"

  return (
    <div className="flex min-h-[100dvh] w-full flex-col lg:flex-row overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/30">
      {/* Main Content Area */}
      <div className={`flex-1 min-h-screen min-h-[300px] p-2 sm:p-4 overflow-hidden transition-all duration-300 ${
        isSidebarExpanded 
          ? 'lg:w-[60%] xl:w-[65%] 2xl:w-[70%]' 
          : 'lg:w-[75%] xl:w-[80%] 2xl:w-[85%]'
      } w-full`}>
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 sm:pt-10 pb-4 sm:pb-8 rounded-xl">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="w-6 h-6" />
            <div className="w-px h-6 bg-border" />
            <h1 className="pl-1 leading-none">
              <span className="text-muted-foreground text-sm sm:text-md">Transactions</span>
              <br />
              <span className="text-xl sm:text-2xl font-bold">Manage your expenses</span>
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <TransactionSheet 
              trigger={
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              }
              onTransactionAdded={() => {
                // Refresh transactions - you can add similar logic here if needed
                window.location.reload()
              }}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4 sm:my-6 w-full">
          {summaryCards.map((card, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.gradientColor} to-transparent rounded-bl-full`} />
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${card.iconBgColor}`}>
                    <div className={card.iconColor}>
                      {card.icon}
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="secondary" className="text-xs hover:scale-105 transition-transform">
                        {card.badge}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="bg-primary mb-1 text-primary-foreground rounded-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-[--radix-tooltip-content-transform-origin] px-3 py-1.5 text-xs text-balance">
                      <p className="font-bold text-center">{card.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-lg sm:text-2xl font-bold tracking-tight">{card.amount}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-muted/30">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className={`w-2 h-2 rounded-full ${card.dotColor}`} />
                    <span>{card.subtitle}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full min-w-0">
            <div className="relative flex-1 max-w-sm min-w-0">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px] min-w-0">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Bills">Bills</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[150px] min-w-0">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Date filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Transaction History</CardTitle>
            <CardDescription>
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="w-full rounded-md border border-muted overflow-hidden">
              <div className="overflow-x-auto w-full max-w-full [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/30">
                <Table className="w-full min-w-[600px]">
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead className="w-[80px] sm:w-[120px] text-center text-xs sm:text-sm">Date</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm">Description</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm">Amount</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm">Category</TableHead>
                      <TableHead className="text-center text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="text-xs sm:text-sm font-medium text-muted-foreground text-center">{transaction.date.substring(0, 10)}</TableCell>
                        <TableCell className="text-xs sm:text-sm font-medium text-foreground truncate text-center max-w-[100px] sm:max-w-none">{transaction.description}</TableCell>
                        <TableCell className="text-xs sm:text-sm text-center font-bold text-green-600">${transaction.amount}</TableCell>
                        <TableCell className="text-xs sm:text-sm text-muted-foreground text-center">
                          <Badge variant="outline" className="text-xs">{transaction.category}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2 sm:gap-4">
                            <TransactionSheet
                              mode="edit"
                              transaction={transaction}
                              onTransactionUpdated={() => {
                                const fetchTransactions = async () => {
                                  try {
                                    const res = await axios.get("/api/transaction")
                                    setTransactions(res.data)
                                  } catch (err: unknown) {
                                    console.error("Failed to load transactions:", err)
                                  }
                                }
                                fetchTransactions()
                              }}
                              trigger={
                                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                                  <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 hover:text-primary" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              }
                            />
                            <TransactionSheet
                              mode="delete"
                              transaction={transaction}
                              onTransactionDeleted={() => {
                                const fetchTransactions = async () => {
                                  try {
                                    const res = await axios.get("/api/transaction")
                                    setTransactions(res.data)
                                  } catch (err: unknown) {
                                    console.error("Failed to load transactions:", err)
                                  }
                                }
                                fetchTransactions()
                              }}
                              trigger={
                                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                                  <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 hover:text-destructive" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel */}
      <div className={`h-auto lg:h-[100vh] p-2 sm:p-4 lg:pl-0 transition-all duration-300 ${
        isSidebarExpanded 
          ? 'lg:w-[25%] xl:w-[25%] 2xl:w-[25%]' 
          : 'lg:w-[25%] xl:w-[25%] 2xl:w-[25%]'
      } w-full lg:block lg:min-w-[20vw] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/30`}>
        <div className="w-full flex items-center justify-between pt-6 lg:pt-11 pb-4 lg:pb-13 rounded-xl">
          <h1 className="text-xl sm:text-2xl font-bold pl-2">Quick Actions</h1>
        </div>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Add New Transaction</CardTitle>
            <CardDescription>Quickly add a new expense or income</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TransactionSheet 
              trigger={
                <Button className="w-full" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              }
              onTransactionAdded={() => {
                const fetchTransactions = async () => {
                  try {
                    const res = await axios.get("/api/transaction")
                    setTransactions(res.data)
                  } catch (err: unknown) {
                    console.error("Failed to load transactions:", err)
                  }
                }
                fetchTransactions()
              }}
            />
            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Income
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Category Breakdown</CardTitle>
            <CardDescription>Spending by category this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budgetStatus.map((category: BudgetStatus) => (
                <div key={category.category} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category.category}</span>
                  <span className="text-sm text-muted-foreground">${category.spent}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 