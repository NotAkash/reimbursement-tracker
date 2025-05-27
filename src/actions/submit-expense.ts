"use server";

import { z } from "zod";
import type { ServerActionState } from "@/types/expense";

import { PORTFOLIO_VALUES } from "@/types/expense";

const serverExpenseSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters.").max(100),
    date: z.coerce.date({
        errorMap: () => ({ message: "Invalid date format." }),
    }),
    amount: z.coerce
        .number()
        .positive("Amount must be a positive number.")
        .max(1000000),
    description: z
        .string()
        .min(5, "Description must be at least 5 characters.")
        .max(500),
    email: z
        .string()
        .email("Invalid email address.")
        .min(5, "Email must be at least 5 characters.")
        .max(500),
    portfolio: z.enum(PORTFOLIO_VALUES, {
        errorMap: () => ({ message: "Invalid portfolio selection." }),
    }),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
	"application/pdf",
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/jpg",
];

export async function submitExpense(
	prevState: ServerActionState | null,
	formData: FormData
): Promise<ServerActionState> {
	const rawFormData = {
		name: formData.get("name"),
		date: formData.get("date"),
		amount: formData.get("amount"),
		description: formData.get("description"),
		emil: formData.get("email"),
		portfolio: formData.get("portfolio"),
	};

	const validatedFields = serverExpenseSchema.safeParse(rawFormData);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Validation failed on server. Please check your input.",
			data: null,
		};
	}

	const receiptFile = formData.get("receipt") as File | null;
	let receiptName: string | undefined = undefined;

	// Validate receipt only if it's provided
	if (receiptFile && receiptFile.size > 0) {
		if (!ALLOWED_FILE_TYPES.includes(receiptFile.type)) {
			return {
				errors: {
					receipt: [
						`Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.join(
							", "
						)}`,
					],
				},
				message: "Invalid file type for receipt.",
				data: null,
			};
		}
		if (receiptFile.size > MAX_FILE_SIZE) {
			return {
				errors: {
					receipt: [
						`File is too large. Max ${
							MAX_FILE_SIZE / 1024 / 1024
						}MB.`,
					],
				},
				message: "Receipt file too large.",
				data: null,
			};
		}
		receiptName = receiptFile.name;
	}
	// Removed the check that made receipt mandatory:
	// if (!receiptFile || receiptFile.size === 0) { ... }

	const { name, date, amount, description, email, portfolio } = validatedFields.data;

	// --- Firebase Integration Placeholder ---
	console.log("Attempting Firebase submission for:", {
		name,
		date,
		amount,
		description,
		email,
		portfolio,
		receipt: receiptName,
	});
	//TODO : Integrate with Firebase Realtime Database
    // This is where you would typically send the data to Firebase.
    // For example:
        // await firebase.database().ref('expenses').push({    
    // --- End Firebase Integration Placeholder ---

	await new Promise((resolve) => setTimeout(resolve, 1500));

	return {
		message: `Expense for "${name}" submitted successfully!`,
		errors: null,
		data: { name, date, amount, description, email, portfolio, receiptName }, // receiptName can be undefined
	};
}
