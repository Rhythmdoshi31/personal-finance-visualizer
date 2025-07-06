"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import axios from "axios"

interface BudgetSheetProps {
    trigger: React.ReactNode
    title?: string
    description?: string
    onBudgetAdded?: () => void
}

export function BudgetSheet({ 
    trigger, 
    title = "Set New Budget", 
    description = "Set a budget for a specific category.",
    onBudgetAdded
}: BudgetSheetProps) {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [formData, setFormData] = React.useState({
        amount: "",
        category: "",
        period: "monthly",
        notes: ""
    })


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.amount || !formData.category) {
            alert("Please fill in all required fields.")
            return
        }

        setLoading(true)
        try {
            await axios.post("/api/budget", {
                amount: parseFloat(formData.amount),
                category: formData.category,
                period: formData.period,
                notes: formData.notes,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear()
            })

            alert("Budget set successfully!")

            setFormData({
                amount: "",
                category: "",
                period: "monthly",
                notes: ""
            })
            setOpen(false)
            
            if (onBudgetAdded) {
                onBudgetAdded()
            }
        } catch (error: unknown) {
            console.error("Failed to set budget:", error)
            alert(error instanceof Error ? error.message : "Failed to set budget. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold mt-6">{title}</SheetTitle>
                    <SheetDescription>
                        {description}
                    </SheetDescription>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Budget Amount</Label>
                            <Input 
                                id="amount"
                                type="number"
                                placeholder="Enter amount"
                                value={formData.amount}
                                onChange={(e) => handleInputChange("amount", e.target.value)}
                                className="mb-2"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Food">Food</SelectItem>
                                    <SelectItem value="Travel">Travel</SelectItem>
                                    <SelectItem value="Shopping">Shopping</SelectItem>
                                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                                    <SelectItem value="Health">Health</SelectItem>
                                    <SelectItem value="Bills">Bills</SelectItem>
                                    <SelectItem value="Others">Others</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="period">Budget Period</Label>
                            <Select value={formData.period} onValueChange={(value) => handleInputChange("period", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Input 
                                id="notes"
                                placeholder="Add notes..."
                                value={formData.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                className="mb-2"
                            />
                        </div>
                        
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Setting Budget..." : "Set Budget"}
                        </Button>
                    </form>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
} 