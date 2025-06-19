"use server";
import { db, rtdb } from "@/lib/firebase";
import type { ServerActionState } from "@/types/expense";
import { expenseSchema } from "@/types/expense"; // Import the unified schema
import { getDatabase, ref, push, set } from "firebase/database";


export async function submitExpense(
	prevState: ServerActionState | null,
	formData: FormData
): Promise<ServerActionState> {
	// Get raw form data, including the file
	const rawFormData = {
		name: formData.get("name"),
		date: formData.get("date") ? new Date(formData.get("date") as string) : "empty",
		amount: formData.get("amount"),
		description: formData.get("description"),
		email: formData.get("email"),
		receipt: formData.get("receipt") as File | null, // Include receipt in raw form data
		portfolio: formData.get("portfolio"),
	};
	
    // Validate raw form data using the unified schema
	const validatedFields = expenseSchema.safeParse(rawFormData);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Validation failed on server. Please check your input.",
			data: null,
		};
	}

	// Extract validated data
	const { name, date, amount, description, email, portfolio, receipt } =
		validatedFields.data;

	// Determine receipt name if a file was uploaded and validated
	const receiptName =
		receipt && receipt.length > 0 ? receipt[0].name : undefined;

	const expenseData = { 
		amount,
		date:(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`).toString(),
		description,
		email,
		name,
		portfolio,
        status: "submitted", // Default status for all new entries
	};
	// --- Firebase Integration Placeholder ---
	console.log("Attempting Firebase submission with validated data:", expenseData);
	// Get a reference to the "expenses" node where you want to push data
	const expensesRef = ref(rtdb, "expenses");

	// Use push() on the reference to add a new item with a unique key
	push(expensesRef, expenseData)
		.then(() => {
			// Data saved successfully!
			console.log("Expense added successfully!");
		})
		.catch((error) => {
			// The write failed...
			console.error("Error adding expense:", error);
		});

	// Default return statement to ensure all code paths return a value
	return {
		errors: null,
		message: "Submission successful.",
		data: {
			name,
			date,
			amount,
			description,
			email,
			portfolio,
			receiptName,
		},
	};
}

/**
 * Get letter from solus. if the letter owrks solus generates letter, i would go to quip officve. 
 */