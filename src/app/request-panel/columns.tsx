"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Records, Record } from "@/types/records";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { deleteExpense, editExpense } from "@/actions/edit-expense";

// Define the type for your request data
export type Request = {
    id: string
    title: string
    amount: number
    status: "pending" | "approved" | "rejected"
    submittedDate: Date
    category: string
}

export const columns: ColumnDef<Record>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "portfolio",
        header: "Portfolio",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const record = row.original;
            const handleEdit = async (statusUpdate: string) => {
                console.log(`Approving record with ID: ${record.id}`);
                try {
                    await editExpense(record.id, statusUpdate); // Call the edit function with new status
                    alert("Record approved successfully!");
                    window.location.reload(); // Refresh the page to reflect the change
                } catch (error) {
                    console.error("Error approving record:", error);
                    alert("Failed to approve the record. Please try again."); // Optional: Show error message
                }
            };
            const handleDelete = async () => {
                console.log(`Deleting record with ID: ${record.id}`);
                try {
                    await deleteExpense(record.id); // Call the delete function
                    alert("Record deleted successfully!"); // Optional: Show success message
                    window.location.reload(); // Refresh the page to reflect the deletion
                } catch (error) {
                    console.error("Error deleting record:", error);
                    alert("Failed to delete the record. Please try again."); // Optional: Show error message
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(record.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit("Approved")}> Approved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit("Completed")}>
                            Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]