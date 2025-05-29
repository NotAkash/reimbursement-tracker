"use server";
import { rtdb } from "@/lib/firebase";
import { ref, remove } from "firebase/database";

export async function deleteExpense(id: string) {
	try {
		const expenseRef = ref(rtdb, `expenses/${id}`);
		await remove(expenseRef);
		return { success: true, message: "Expense deleted successfully." };
	} catch (error) {
		console.error("Error deleting expense:", error);
		return { success: false, message: "Failed to delete expense." };
	}
}
