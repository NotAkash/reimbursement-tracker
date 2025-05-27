import Image from "next/image";
import { ExpenseForm } from "@/components/expense-form";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12">
            <div className="w-full max-w-2xl space-y-8">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Easily submit your expense reports.
                    </h1>
                    <p className="mt-2 text-md text-gray-600">
                    </p>
                </header>
                <ExpenseForm />
            </div>
        </main>
    );
}
