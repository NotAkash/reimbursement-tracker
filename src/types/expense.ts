import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
	"application/pdf",
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/jpg",
];
// Updated and centralized portfolio values
export const PORTFOLIO_VALUES = [
	"events",
	"socials",
	"marketing",
	"professional development",
	"executive",
	"internal affairs",
	"tech team",
	"academics",
	"equity",
] as const;

export const expenseSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Name must be at least 2 characters." })
		.max(100, { message: "Name must be less than 100 characters." }),
	date: z.date({
		required_error: "Please select a date.",
		invalid_type_error: "Invalid date format.",
	}),
	amount: z.coerce
		.number({ invalid_type_error: "Amount must be a number." })
		.positive({ message: "Amount must be a positive number." })
		.max(200000, { message: "Amount seems too high." }),
	description: z
		.string()
		.min(5, { message: "Description must be at least 5 characters." })
		.max(500, { message: "Description must be less than 500 characters." }),
	email: z.string().email({ message: "Invalid email address." }),
	portfolio: z.enum(PORTFOLIO_VALUES, {
		errorMap: () => ({ message: "Invalid portfolio selection." }),
	}),
	receipt: z
		.custom<FileList>()
		.optional() // Made optional
		.refine(
			(files) =>
				!files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE, // Validate size only if files exist
			`Receipt must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`
		)
		.refine(
			(files) =>
				!files ||
				files.length === 0 ||
				ALLOWED_FILE_TYPES.includes(files[0]?.type), // Validate type only if files exist
			"Only PDF, JPG, PNG, WEBP files are allowed."
		),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

export interface ServerActionState {
	message: string | null;
	errors?: {
		name?: string[];
		date?: string[];
		amount?: string[];
		description?: string[];
		email?: string[];
		portfolio?: string[];
		receipt?: string[];
		general?: string[];
	} | null;
	data?: {
		name: string;
		date: Date;
		amount: number;
		description: string;
		email: string;
		portfolio: (typeof PORTFOLIO_VALUES)[number];
		receiptName?: string; // Receipt name is now optional
	} | null;
}
