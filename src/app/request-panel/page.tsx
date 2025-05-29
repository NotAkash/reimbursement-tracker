import Link from "next/link";
import ExpenseTable from "./expense-table";

export default function RequestPanel() {
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
            <ExpenseTable />
        </div>
    );
}
//get the results from all the data in const firebase rtdb: "expenses" as a new schema "records" in new file at type/records and then pass it to ExpenseTable where it turns the table into data