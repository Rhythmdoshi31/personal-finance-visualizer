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
import { PencilIcon, PieChartIcon, PlaneIcon, ShoppingBagIcon, TrashIcon, SearchIcon, TrendingUp, GaugeCircle, CalendarPlus, Wallet, PiggyBankIcon, Filter, TrendingDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
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
    _id: string
    category: string
    isOverBudget: boolean
    spent: number
    budget: number
    percentage: number
}
type MonthlyBreakdown = {
    month: string
    total: number
}
type MonthlySummary = {
    totalSpent: number
    totalIncome: number
    percentageSpent: number
}
export function Dashboard() {
    const [categoryFilter, setCategoryFilter] = React.useState("all");
    const [searchTerm, setSearchTerm] = React.useState("");
    const [dateFilter, setDateFilter] = React.useState("all");
    const { state } = useSidebar();
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [budgetStatus, setBudgetStatus] = React.useState<BudgetStatus[]>([]);
    const [monthlyBreakdown, setMonthlyBreakdown] = React.useState<MonthlyBreakdown[]>([]);
    const [monthlySummary, setMonthlySummary] = React.useState<MonthlySummary | null>(null);

    React.useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axios.get("/api/transaction");
                const res2 = await axios.get("/api/insights/budget-status");
                const res3 = await axios.get("/api/insights/yearly-breakdown");
                const res4 = await axios.get("/api/insights/monthly-summary");
                setTransactions(res.data);
                const filteredBudgets = res2.data.filter((budget: BudgetStatus) =>
                    ["Food", "Travel", "Shopping"].includes(budget.category)
                );
                setBudgetStatus(filteredBudgets);
                setMonthlyBreakdown(res3.data);
                setMonthlySummary(res4.data);
            } catch (err: unknown) {
                console.error("Failed to load transactions", err)
            }
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

    const chartData = monthlyBreakdown.map((item, index) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const monthNumber = parseInt(item.month.split('-')[1]) - 1 // Convert "2025-01" to 0 for Jan
        const monthName = monthNames[monthNumber]

        const purpleColors = ["#faf5ff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#9333ea"]

        return {
            month: monthName,
            expenses: item.total,
            fill: purpleColors[index % purpleColors.length]
        }
    })
    const chartConfig = {
        expenses: {
            label: "Expenses",
        },
        ...chartData.reduce((config, item) => ({
            ...config,
            [item.month]: {
                label: item.month,
                color: item.fill,
            }
        }), {})
    } satisfies ChartConfig

    const increaseInSpending = chartData.length >= 2 ? (chartData[chartData.length - 1].expenses - chartData[chartData.length - 2].expenses) / 100 : 0;

    const getMonthlyQuote = () => {
        const dayOfMonth = new Date().getDate()
        if (dayOfMonth >= 21) {
            return (
                <div className="flex items-center gap-2 text-sm sm:text-md text-purple-600 text-center">
                    <Wallet className="h-4 w-4 text-primary" />
                    <span>New month, new budget - let&apos;s begin wisely.</span>
                </div>
            )
        } else if (dayOfMonth >= 11) {
            return (
                <div className="flex items-center gap-2 text-sm sm:text-md text-blue-500 text-center">
                    <GaugeCircle className="h-4 w-4 text-primary" />
                    <span>Midway check-in - are you on track?</span>
                </div>
            )
        } else {
            return (
                <div className="flex items-center gap-2 text-sm sm:text-md text-green-500 text-center">
                    <CalendarPlus className="h-4 w-4 text-primary" />
                    <span>Set your tone now - spend with purpose.</span>
                </div>
            )
        }
    }

    const isSidebarExpanded = state === "expanded"

    return (
        <div className="flex min-h-[100dvh] w-full flex-col lg:flex-row overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/30">
            {/* Main Content Area */}
            <div className={`flex-1 min-h-screen min-h-[300px] p-2 sm:p-4 overflow-hidden transition-all duration-300 ${isSidebarExpanded
                    ? 'lg:w-[60%] xl:w-[65%] 2xl:w-[70%]'
                    : 'lg:w-[75%] xl:w-[80%] 2xl:w-[85%]'
                } w-full`}>
                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 sm:pt-10 pb-4 sm:pb-8 rounded-xl">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="w-6 h-6" />
                        <div className="w-px h-6 bg-border" />
                        <h1 className="pl-1 leading-none">
                            <span className="text-muted-foreground text-sm sm:text-md">Welcome Back,</span>
                            <br />
                            <span className="text-xl sm:text-2xl font-bold">Let&apos;s manage money!</span>
                        </h1>
                    </div>
                    <TransactionSheet
                        trigger={
                            <Button className="bg-primary text-primary-foreground font-bold text-sm sm:text-md py-1 px-2 cursor-pointer relative z-10 rounded-md w-full sm:w-auto">
                                + Add Transaction
                            </Button>
                        }
                        onTransactionAdded={() => {
                            // Refresh transactions
                            const fetchTransactions = async () => {
                                try {
                                    const res = await axios.get("/api/transaction")
                                    setTransactions(res.data)
                                } catch (err: unknown) {
                                    console.error("Failed to load transactions", err)
                                }
                            }
                            fetchTransactions()
                        }}
                    />
                </div>
                <div className="relative overflow-hidden min-h-[120px] sm:h-34 flex flex-col sm:flex-row items-center justify-between p-4 sm:px-4 rounded-xl border-[2px] border-muted my-4 sm:my-6 w-full bg-gradient-to-tr from-muted via-muted/30 to-muted/0" >
                    <div className="absolute top-0 right-0 w-40 sm:w-80 h-20 sm:h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />
                    <div className="flex flex-col gap-1 justify-center text-center sm:text-left">
                        <div className="text-muted-foreground text-sm">Total Expenses</div>
                        <div className="text-2xl sm:text-3xl font-bold">${monthlySummary?.totalSpent?.toFixed(2) || '0.00'} <span className="text-muted-foreground text-xs sm:text-sm">/ ${monthlySummary?.totalIncome?.toFixed(2) || '00.0'}</span></div>
                    </div>

                    <Tooltip>
                        <TooltipTrigger>
                            <Badge className="font-bold text-sm sm:text-md py-1 px-2 cursor-pointer relative z-10 mt-4 sm:mt-0">{monthlySummary?.percentageSpent?.toFixed(2) || '0.00'}%</Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-primary mb-1 text-primary-foreground rounded-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) px-3 py-1.5 text-xs text-balance">
                            <p className="font-bold text-center">{monthlySummary?.percentageSpent?.toFixed(2) || '0.00'}% of your total <br /> income has been spent!</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* Grid of 3 cards below */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4 sm:my-6 w-full">
                    {budgetStatus && budgetStatus.map((budget: BudgetStatus, index: number) => {
                        // Dynamic color logic based on percentage
                        const getColorScheme = (percentage: number) => {
                            if (percentage === 100) {
                                return {
                                    gradientColor: "from-blue-500/5",
                                    iconBgColor: "bg-blue-500/10",
                                    iconColor: "text-blue-600",
                                    dotColor: "bg-blue-500/60",
                                    badgeColor: "bg-blue-500"
                                }
                            } else if (percentage < 100) {
                                return {
                                    gradientColor: "from-green-500/5",
                                    iconBgColor: "bg-green-500/10",
                                    iconColor: "text-green-600",
                                    dotColor: "bg-green-500/60",
                                    badgeColor: "bg-green-500"
                                }
                            } else {
                                return {
                                    gradientColor: "from-red-500/5",
                                    iconBgColor: "bg-red-500/10",
                                    iconColor: "text-red-600",
                                    dotColor: "bg-red-500/60",
                                    badgeColor: "bg-red-500"
                                }
                            }
                        }

                        const colorScheme = getColorScheme(budget.percentage)
                        const icons = [
                            <PieChartIcon key="pie" className="w-6 h-6" />,
                            <ShoppingBagIcon key="shopping" className="w-6 h-6" />,
                            <PlaneIcon key="plane" className="w-6 h-6" />
                        ]

                        return (
                            <Card
                                key={index}
                                className="relative overflow-hidden border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorScheme.gradientColor} to-transparent rounded-bl-full`} />
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <div className={`p-1.5 sm:p-2 rounded-lg ${colorScheme.iconBgColor}`}>
                                            <div className={colorScheme.iconColor}>{icons[index]}</div>
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Badge className={`font-bold text-xs py-1 px-2 ${colorScheme.badgeColor} hover:scale-105 transition-transform`}>
                                                    {budget.percentage.toFixed(1)}%
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-primary mb-1 text-primary-foreground rounded-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-[--radix-tooltip-content-transform-origin] px-3 py-1.5 text-xs text-balance">
                                                <p className="font-bold text-center">
                                                    {budget.percentage === 0 ? "On track with budget" :
                                                        budget.percentage < 0 ? "Under budget - Great job!" :
                                                            "Over budget - Watch your spending!"}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">{budget.category}</p>
                                        <p className="text-lg sm:text-2xl font-bold tracking-tight">${budget.spent.toFixed(2)} <span className="text-xs sm:text-sm text-muted-foreground">/ ${budget.budget.toFixed(2)}</span></p>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-muted/30">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <div className={`w-2 h-2 rounded-full ${colorScheme.dotColor}`} />
                                            <span>This month</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
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
            <div className={`h-auto lg:h-[100vh] p-2 sm:p-4 lg:pl-0 transition-all duration-300 ${isSidebarExpanded
                    ? 'lg:w-[25%] xl:w-[25%] 2xl:w-[25%]'
                    : 'lg:w-[25%] xl:w-[25%] 2xl:w-[25%]'
                } w-full lg:block lg:min-w-[20vw] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/30`}>
                <div className="w-full flex items-center justify-between pt-6 lg:pt-11 pb-4 lg:pb-13 rounded-xl">
                    <h1 className="text-xl sm:text-2xl font-bold pl-2">Monthly Expenses <br className="hidden sm:block" />Overview</h1>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Bar Chart - Monthly</CardTitle>
                            <CardDescription>
                                {chartData.length > 0 ?
                                    `${chartData[0].month} - ${chartData[chartData.length - 1].month} 2025` :
                                    "Loading monthly data..."
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chartData.length > 0 ? (
                                <ChartContainer config={chartConfig} className="h-[25vh] sm:h-[30vh] w-full">
                                    <BarChart
                                        accessibilityLayer
                                        data={chartData}
                                        layout="vertical"
                                        margin={{ left: 0 }}
                                        barGap={2}
                                        barCategoryGap={0.5}
                                    >
                                        <YAxis
                                            dataKey="month"
                                            type="category"
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                        />
                                        <XAxis dataKey="expenses" type="number" hide />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Bar dataKey="expenses" radius={5} barSize={20} />
                                    </BarChart>
                                </ChartContainer>
                            ) : (
                                <div className="h-[25vh] sm:h-[30vh] w-full flex items-center justify-center text-muted-foreground">
                                    Loading chart data...
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-xs sm:text-sm">
                            <div className="flex gap-2 leading-none font-medium">
                                {increaseInSpending > 0 ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />}
                                <span className="text-xs sm:text-sm">
                                    {increaseInSpending > 0 ? `Spending increased by ${increaseInSpending.toFixed(2)}% this month` : `Spending decreased by ${Math.abs(increaseInSpending).toFixed(2)}% this month`}
                                </span>
                            </div>
                            <div className="text-muted-foreground leading-none text-xs sm:text-sm">
                                Still within your set monthly budget.
                            </div>
                        </CardFooter>
                    </Card>
                </div>
                <div className="w-full flex flex-col items-center justify-between mt-4 sm:mt-8 py-4 sm:py-8 px-2 sm:px-4 rounded-xl bg-muted/50">
                    {getMonthlyQuote()}
                    <div className="flex items-center justify-center gap-2 mt-4 text-center">
                        <PiggyBankIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        <h1 className="text-purple-500 text-sm sm:text-md">&quot;Do not save what is left after spending, but spend what is left after saving.&quot; - Warren Buffett</h1>
                    </div>
                </div>
            </div>
        </div>
    )
} 