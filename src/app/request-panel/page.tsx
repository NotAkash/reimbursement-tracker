import Link from "next/link";
import ExpenseTable from "./expense-table";
import { rtdb } from "@/lib/firebase";
import { ref, get, child } from "firebase/database";
import { ColumnDef } from "@tanstack/react-table"


import { columns } from "./columns";
import { Records } from "@/types/records";

export default async function RequestPanel() {
    let records: Records = [];
    const dbRef = ref(rtdb);
    try {
        const snapshot = await get(child(dbRef, "expenses"));
        if (snapshot.exists()) {
            const data = snapshot.val();
            records = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })) as Records;
        } else {
            return <p className="text-red-500">Failed to load data. Please try again later.</p>;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return <p className="text-red-500">Failed. Please try again later.</p>;
    }
    // console.log("Records fetched:", records);
    return (
        <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 justify-between">
            <div className="w-full max-w-2xl space-y-8 bg-secondary p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl text-center font-bold sm:text-4xl">
                    Request Panel
                </h1>
                <p className="text-center">
                    Approve, Confirm or Reject expense requests from the team.
                    <br />
                </p>
            </div>
            <br />
            <ExpenseTable columns={columns} data={records} />
        </div>
    );
}