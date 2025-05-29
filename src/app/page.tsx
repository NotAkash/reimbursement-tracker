import Image from "next/image";
import { ExpenseForm } from "@/components/expense-form";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12">
            <div className="w-full max-w-2xl space-y-8 bg-#321d53">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">
                        Easily submit your expense reports.
                    </h1>
                </header>
                <ExpenseForm />
            </div>
        </main>
    );
}
