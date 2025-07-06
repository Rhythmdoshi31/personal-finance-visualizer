"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDownIcon, Trash2 } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import axios from "axios"

interface Transaction {
    _id: string
    amount: number
    description: string
    category: string
    date: string
}

interface TransactionSheetProps {
    trigger: React.ReactNode
    onTransactionAdded?: () => void
    onTransactionUpdated?: () => void
    onTransactionDeleted?: () => void
    mode?: 'add' | 'edit' | 'delete'
    transaction?: Transaction
}

export function TransactionSheet({ 
    trigger, 
    onTransactionAdded, 
    onTransactionUpdated, 
    onTransactionDeleted,
    mode = 'add',
    transaction 
}: TransactionSheetProps) {
    const [open, setOpen] = React.useState(false)

    // Debug logging
    React.useEffect(() => {
        console.log("TransactionSheet state:", { open, mode, transaction: transaction?._id })
    }, [open, mode, transaction])
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [formData, setFormData] = React.useState({
        amount: "",
        description: "",
        category: "",
        date: new Date().toISOString().split('T')[0]
    })
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    // Initialize form data when editing
    React.useEffect(() => {
        if (transaction && mode === 'edit') {
            setFormData({
                amount: transaction.amount.toString(),
                description: transaction.description,
                category: transaction.category,
                date: new Date(transaction.date).toISOString().split('T')[0]
            })
            setDate(new Date(transaction.date))
        } else if (mode === 'add') {
            setFormData({
                amount: "",
                description: "",
                category: "",
                date: new Date().toISOString().split('T')[0]
            })
            setDate(new Date())
        }
    }, [transaction, mode, open])

    // Clear error when sheet opens
    React.useEffect(() => {
        if (open) {
            setError("")
        }
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            if (mode === 'delete') {
                await axios.delete(`/api/transaction/${transaction?._id}`)
                alert("Transaction deleted successfully!")
                if (onTransactionDeleted) {
                    onTransactionDeleted()
                }
            } else {
                const submitData = {
                    amount: parseFloat(formData.amount),
                    description: formData.description,
                    category: formData.category,
                    date: date ? date.toISOString() : new Date().toISOString()
                }
                
                if (mode === 'edit') {
                    await axios.patch(`/api/transaction/${transaction?._id}`, submitData)
                    alert("Transaction updated successfully!")
                    if (onTransactionUpdated) {
                        onTransactionUpdated()
                    }
                } else {
                    await axios.post("/api/transaction", submitData)
                    alert("Transaction added successfully!")
                    if (onTransactionAdded) {
                        onTransactionAdded()
                    }
                }
            }
            
            // Reset form for add mode
            if (mode === 'add') {
                setFormData({
                    amount: "",
                    description: "",
                    category: "",
                    date: new Date().toISOString().split('T')[0]
                })
                setDate(new Date())
            }
            
            setError("")
            setOpen(false)
        } catch (error: unknown) {
            console.error("Failed to process transaction:", error)
            if (error instanceof Error && error.message) {
                setError(error.message)
            } else {
                setError(`Failed to ${mode} transaction. Please try again.`)
            }
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

    const getTitle = () => {
        switch (mode) {
            case 'edit':
                return 'Edit Transaction'
            case 'delete':
                return 'Delete Transaction'
            default:
                return 'Add New Transaction'
        }
    }

    const getDescription = () => {
        switch (mode) {
            case 'edit':
                return 'Update the transaction details below.'
            case 'delete':
                return 'Are you sure you want to delete this transaction? This action cannot be undone.'
            default:
                return 'Add a new transaction to your account.'
        }
    }

    const getButtonText = () => {
        switch (mode) {
            case 'edit':
                return loading ? "Updating..." : "Update Transaction"
            case 'delete':
                return loading ? "Deleting..." : "Delete Transaction"
            default:
                return loading ? "Adding..." : "Add Transaction"
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold mt-6">{getTitle()}</SheetTitle>
                    <SheetDescription>
                        {getDescription()}
                    </SheetDescription>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
                        {error && (
                            <div className="text-red-500 text-sm mb-2 p-2 bg-red-50 rounded border border-red-200">
                                {error}
                            </div>
                        )}
                        
                        {mode !== 'delete' && (
                            <>
                                <Input 
                                    placeholder="Transaction Amount" 
                                    className="mb-2"
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => handleInputChange("amount", e.target.value)}
                                    required
                                />
                                <Input 
                                    placeholder="Transaction Description" 
                                    className="mb-2"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    required
                                />
                                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" className="mb-2"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Food">Food</SelectItem>
                                        <SelectItem value="Travel">Travel</SelectItem>
                                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                                        <SelectItem value="Shopping">Shopping</SelectItem>
                                        <SelectItem value="Health">Health</SelectItem>
                                        <SelectItem value="Bills">Bills</SelectItem>
                                        <SelectItem value="Others">Others</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex flex-col gap-3 mb-2">
                                    <Label htmlFor="date" className="px-1">
                                        Date of Transaction
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                id="date"
                                                className="w-48 justify-between font-normal"
                                            >
                                                {date ? date.toLocaleDateString() : "Select date"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                captionLayout="dropdown"
                                                onSelect={(date) => {
                                                    setDate(date)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </>
                        )}
                        
                        {mode === 'delete' && transaction && (
                            <div className="p-4 border border-muted-foreground rounded-lg mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                    <span className="font-semibold text-red-700">Transaction Details</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p><strong>Amount:</strong> ${transaction.amount}</p>
                                    <p><strong>Description:</strong> {transaction.description}</p>
                                    <p><strong>Category:</strong> {transaction.category}</p>
                                    <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex gap-2">
                            <Button 
                                type="submit" 
                                className="flex-1 hover:shadow-lg" 
                                disabled={loading}
                                variant={mode === 'delete' ? 'destructive' : 'default'}
                            >
                                {getButtonText()}
                            </Button>
                            {mode === 'delete' && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setOpen(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
} 