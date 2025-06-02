// src/types/records.ts

export type RecordType = {
	id: string;
	amount: number;
	description: string;
	email: string;
	name: string;
	portfolio: string;
	status: "submitted" | "approved" | "completed" | "delete";
}
export interface Record {
	id: string;
	amount: number;
	description: string;
	email: string;
	name: string;
	portfolio: string;
	status: string;
}

export type Records = Record[];
