"use server";
import { rtdb } from "@/lib/firebase";
import { ref, remove, update, get, child } from "firebase/database";
import { Records } from "@/types/records";


export async function aggregateExpenses(){
    // Function to fetch all expenses from Firebase Realtime Database
    // and return the total amount, grouped by portfolio.
    let records: Records = [];
    const dbRef = ref(rtdb);
    try {
        const snapshot = await get(child(dbRef, "expenses"));
        if (snapshot.exists()) {
            const data = snapshot.val();
            records = Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
            })) as Records;

            // Aggregate expenses by portfolio
            const aggregatedData = records.reduce((acc, record) => {
                if (!acc[record.portfolio]) {
                    acc[record.portfolio] = 0;
                }
                acc[record.portfolio] += record.amount;
                return acc;
            }, {} as Record<string, number>);

            return {
                success: true,
                data: aggregatedData,
                message: "Data fetched and aggregated successfully.",
            };
        } else {
            return { success: false, data: {}, message: "No data found." };
        }
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return { success: false, data: {}, message: "Failed to fetch data." };
    }   
}


export async function pickEvents(portfolio: string | null = null) {
	// Function to fetch expenses from Firebase Realtime Database
	// and filter them based on the provided portfolio.
	// If portfolio is null, it returns all expenses.
	let records: Records = [];
	const dbRef = ref(rtdb);
	try {
		const snapshot = await get(child(dbRef, "expenses"));
		if (snapshot.exists()) {
			const data = snapshot.val();
			records = Object.keys(data).map((key) => ({
				id: key,
				...data[key],
			})) as Records;
			const filteredRecords = portfolio
				? records.filter((record) => record.portfolio === portfolio)
				: records;
			if (filteredRecords.length > 0) {
				return {
					success: true,
					data: filteredRecords,
					message: "Data fetched successfully.",
				};
			} else if (portfolio) {
				return {
					success: false,
					data: [],
					message: "No data found for the specified portfolio.",
				};
			} else {
				return { success: false, data: [], message: "No data found." };
			}
		} else {
			return { success: false, data: [], message: "No data found." };
		}
	} catch (error) {
		console.error("Error fetching data:", error);
        return { success: false, data: [], message: "Failed to fetch data." };
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
