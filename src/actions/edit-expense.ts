"use server";
import { rtdb } from "@/lib/firebase";
import { ref, remove, update } from "firebase/database";


export async function editExpense(id: string, updatedData: string) {
    try {
        const expenseRef = ref(rtdb, `expenses/${id}`);
        await update(expenseRef, {
            status: updatedData, // Update the status or any other field as needed });
        });
        console.log("Expense updated successfully:", id, updatedData);
        return { success: true, message: "Expense updated successfully." };
    }
    catch (error) {
        console.error("Error updating expense:", error);
        return { success: false, message: "Failed to update expense." };
    }   
}


export async function deleteExpense(id: string) {
	try {
		const expenseRef = ref(rtdb, `expenses/${id}`);
		await remove(expenseRef);
        console.log("Expense deleted successfully:", id);
		return { success: true, message: "Expense deleted successfully." };
	} catch (error) {
		console.error("Error deleting expense:", error);
		return { success: false, message: "Failed to delete expense." };
	}
}


    