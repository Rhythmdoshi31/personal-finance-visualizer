"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BudgetSheet } from "@/components/budget-sheet"
import { useSidebar } from "@/components/ui/sidebar"
import axios from "axios"

type BudgetStatus = {
    _id: string
    category: string
    isOverBudget: boolean
    spent: number
    budget: number
    percentage: number
}

export function Budgets() {
    const { state } = useSidebar();
    const [budgetStatus, setBudgetStatus] = React.useState<BudgetStatus[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchBudgetStatus = async () => {
            try {
                const res = await axios.get("/api/insights/budget-status");
                setBudgetStatus(res.data);
            } catch (err: unknown) {
                console.error("Failed to load budget status", err)
            } finally {
                setLoading(false)
            }
        }
        fetchBudgetStatus()
    }, []);

    // Filter out categories with 0% spending
    const filteredBudgetStatus = budgetStatus.filter(budget => budget.percentage > 0);

    const barChartData = filteredBudgetStatus.map(budget => ({
        category: budget.category,
        spent: budget.spent,
        budget: budget.budget
    }));

    const pieChartData = filteredBudgetStatus.map(budget => ({
        name: budget.category,
        value: budget.spent
    }));

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000', '#00ff00'];

    const barChartConfig = {
        spent: {
            label: "Spent",
            color: "#ef4444",
        },
        budget: {
            label: "Budget",
            color: "#3b82f6",
        },
    } satisfies ChartConfig

    const pieChartConfig = {
        ...pieChartData.reduce((config, item) => ({
            ...config,
            [item.name]: {
                label: item.name,
                color: COLORS[pieChartData.indexOf(item) % COLORS.length],
            }
        }), {})
    } satisfies ChartConfig

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
                            <span className="text-muted-foreground text-sm sm:text-md">Budget</span>
                            <br />
                            <span className="text-xl sm:text-2xl font-bold">Management</span>
                        </h1>
                    </div>
                    <BudgetSheet 
                        trigger={
                            <Button className="bg-primary text-primary-foreground font-bold text-sm sm:text-md py-1 px-2 cursor-pointer relative z-10 rounded-md w-full sm:w-auto">
                                + Add Budget
                            </Button>
                        }
                        onBudgetAdded={() => {
                            // Refresh budget status
                            const fetchBudgetStatus = async () => {
                                try {
                                    const res = await axios.get("/api/insights/budget-status")
                                    setBudgetStatus(res.data)
                                } catch (err: unknown) {
                                    console.error("Failed to load budget status", err)
                                }
                            }
                            fetchBudgetStatus()
                        }}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-4 sm:my-6 w-full">
                    {/* Double Bar Chart */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Budget vs Spent</CardTitle>
                                <CardDescription>
                                    Comparison of budgeted vs actual spending by category
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {barChartData.length > 0 ? (
                                    <ChartContainer config={barChartConfig} className="h-[40vh] w-full">
                                        <BarChart
                                            data={barChartData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <XAxis dataKey="category" />
                                            <YAxis />
                                            <ChartTooltip
                                                content={<ChartTooltipContent />}
                                            />
                                            <Bar dataKey="spent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="h-[40vh] w-full flex items-center justify-center text-muted-foreground">
                                        {loading ? "Loading budget data..." : "No budget data available"}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Pie Chart */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Spending by Category</CardTitle>
                                <CardDescription>
                                    Distribution of spending across categories
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pieChartData.length > 0 ? (
                                    <ChartContainer config={pieChartConfig} className="h-[40vh] w-full">
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip
                                                content={<ChartTooltipContent />}
                                            />
                                        </PieChart>
                                    </ChartContainer>
                                ) : (
                                    <div className="h-[40vh] w-full flex items-center justify-center text-muted-foreground">
                                        {loading ? "Loading spending data..." : "No spending data available"}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4 sm:my-6 w-full">
                    {filteredBudgetStatus.slice(0, 3).map((budget) => {
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
                        
                        return (
                            <Card
                                key={budget._id}
                                className="relative overflow-hidden border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorScheme.gradientColor} to-transparent rounded-bl-full`} />
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <div className={`p-1.5 sm:p-2 rounded-lg ${colorScheme.iconBgColor}`}>
                                            <div className={colorScheme.iconColor}>
                                                <div className="w-6 h-6 rounded-full bg-current opacity-20" />
                                            </div>
                                        </div>
                                        <Badge className={`font-bold text-xs py-1 px-2 ${colorScheme.badgeColor} hover:scale-105 transition-transform`}>
                                            {budget.percentage.toFixed(1)}%
                                        </Badge>
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
            </div>

            {/* Right Panel */}
            <div className={`h-auto lg:h-[100vh] p-2 sm:p-4 lg:pl-0 transition-all duration-300 ${
                isSidebarExpanded 
                    ? 'lg:w-[25%] xl:w-[25%] 2xl:w-[25%]' 
                    : 'lg:w-[25%] xl:w-[25%] 2xl:w-[25%]'
            } w-full lg:block lg:min-w-[20vw] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/30`}>
                <div className="w-full flex items-center justify-between pt-6 lg:pt-11 pb-4 lg:pb-13 rounded-xl">
                    <h1 className="text-xl sm:text-2xl font-bold pl-2">Budget <br className="hidden sm:block" />Overview</h1>
                </div>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Budget Summary</CardTitle>
                            <CardDescription>
                                Overview of your budget performance
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Budget</span>
                                <span className="font-semibold">${filteredBudgetStatus.reduce((sum, budget) => sum + budget.budget, 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total Spent</span>
                                <span className="font-semibold text-red-600">${filteredBudgetStatus.reduce((sum, budget) => sum + budget.spent, 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Remaining</span>
                                <span className="font-semibold text-green-600">${(filteredBudgetStatus.reduce((sum, budget) => sum + budget.budget, 0) - filteredBudgetStatus.reduce((sum, budget) => sum + budget.spent, 0)).toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
} 