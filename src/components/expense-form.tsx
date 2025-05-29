"use client";

import type { ChangeEvent } from 'react';
import { useState, useEffect, useActionState, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { expenseSchema, PORTFOLIO_VALUES, type ExpenseFormValues, type ServerActionState } from '@/types/expense';
import { submitExpense } from '../actions/submit-expense';

const initialServerState: ServerActionState = {
    message: null,
    errors: null,
    data: null,
};

// Helper function to format portfolio labels (e.g., "professional development" -> "Professional Development")
const formatPortfolioLabel = (value: string): string => {
    return value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const portfolioOptions = PORTFOLIO_VALUES.map(value => ({
    value: value,
    label: formatPortfolioLabel(value),
}));


export function ExpenseForm() {
    const [serverState, formAction, isPending] = useActionState(submitExpense, initialServerState);
    const [selectedFileName, setSelectedFileName] = useState<string>("No file selected");

    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            name: "",
            date: undefined,
            amount: undefined,
            description: "",
            email: "",
            portfolio: undefined,
            receipt: undefined,
        },
        // mode: "onChange" // Uncomment for more aggressive validation
    });

    const { register, handleSubmit, formState: { errors }, reset, setError } = form;

    useEffect(() => {
        if (serverState?.message) {
            if (serverState.errors || !serverState.data) { // Error state or message without success data
                if (serverState.errors) {
                    (Object.keys(serverState.errors) as Array<keyof ExpenseFormValues | 'general'>).forEach((formKey) => {
                        if (formKey !== 'general') {
                            const fieldName = formKey as keyof ExpenseFormValues;
                            const errorMessages = serverState.errors?.[fieldName]; // Access specific field errors
                            if (errorMessages && errorMessages.length > 0) {
                                setError(fieldName, { type: 'server', message: errorMessages[0] });
                            }
                        }
                    });
                }
            } else if (serverState.data) { // Success state
                reset();
                setSelectedFileName("No file selected");
            }
        }
    }, [serverState, reset, setError]);

    const onSubmit = (values: ExpenseFormValues) => {
        const formData = new FormData();
        formData.append("name", values.name);
        if (values.date) {
            formData.append("date", values.date.toISOString());
        }
        formData.append("amount", String(values.amount));
        formData.append("description", values.description);
        formData.append("email", values.email);
        formData.append("portfolio", values.portfolio);

        if (values.receipt && values.receipt.length > 0) {
            formData.append("receipt", values.receipt[0]);
        }

        // Wrap formAction in startTransition
        startTransition(() => {
            formAction(formData);
        });
    };

    const handleReceiptChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setSelectedFileName(files[0].name);
            // Let react-hook-form handle setting the value via register's onChange
            // Manually calling setValue here if also using register's onChange can be redundant
            // but we ensure it's set and validated.
            form.setValue('receipt', files, { shouldValidate: true });
        } else {
            setSelectedFileName("No file selected");
            form.setValue('receipt', undefined, { shouldValidate: true });
        }
    };

    const commonInputStyle = "bg-primary-foreground mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    const errorTextStyle = "mt-1 text-sm text-red-600";
    const labelStyle = "block text-sm font-medium text-chart-4";

    return (
        <div className="w-full p-4 border border-gray-200 rounded-lg shadow-md bg-card">
            <header className="mb-4">
                <h2 className="text-xl font-semibold">New Expense Report</h2>
                <p className="text-sm">Fill in the details of your expense and upload the receipt.</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="name" className={labelStyle}>Full Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="e.g. Jane Doe"
                        {...register("name")}
                        className={commonInputStyle}
                        aria-invalid={errors.name ? "true" : "false"}
                    />
                    {errors.name && <p className={errorTextStyle} role="alert">{errors.name.message}</p>}
                </div>

                <div>
                    <label htmlFor="date" className={labelStyle}>Date of Expense</label>
                    <input
                        id="date"
                        type="date"
                        {...register("date", { valueAsDate: true })}
                        className={commonInputStyle}
                        aria-invalid={errors.date ? "true" : "false"}
                    />
                    {errors.date && <p className={errorTextStyle} role="alert">{errors.date.message}</p>}
                </div>

                <div>
                    <label htmlFor="amount" className={labelStyle}>Amount (USD)</label>
                    <input
                        id="amount"
                        type="number"
                        placeholder="e.g. 25.99"
                        step="0.01"
                        {...register("amount", { valueAsNumber: true })}
                        className={commonInputStyle}
                        aria-invalid={errors.amount ? "true" : "false"}
                    />
                    {errors.amount && <p className={errorTextStyle} role="alert">{errors.amount.message}</p>}
                </div>

                <div>
                    <label htmlFor="portfolio" className={labelStyle}>Portfolio</label>
                    <select
                        id="portfolio"
                        {...register("portfolio")}
                        className={commonInputStyle}
                        aria-invalid={errors.portfolio ? "true" : "false"}
                        defaultValue="" // Ensure a default non-valid value for required select
                    >
                        <option value="" disabled>Select a portfolio</option>
                        {portfolioOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.portfolio && <p className={errorTextStyle} role="alert">{errors.portfolio.message}</p>}
                </div>

                <div>
                    <label htmlFor="description" className={labelStyle}>Description</label>
                    <textarea
                        id="description"
                        placeholder="e.g. Lunch meeting with client"
                        {...register("description")}
                        className={`${commonInputStyle} min-h-[80px]`}
                        aria-invalid={errors.description ? "true" : "false"}
                    />
                    {errors.description && <p className={errorTextStyle} role="alert">{errors.description.message}</p>}
                </div>
                <div>
                    <label htmlFor="email" className={labelStyle}>Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="E-transfer email"
                        {...register("email")}
                        className={commonInputStyle}
                        aria-invalid={errors.email ? "true" : "false"}
                    />
                    {errors.email && <p className={errorTextStyle} role="alert">{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="receipt-upload" className={labelStyle}>Receipt</label>
                    <input
                        id="receipt-upload"
                        type="file"
                        accept=".pdf,image/jpeg,image/png,image/webp,image/jpg"
                        {...register("receipt")} // onChange is implicitly handled by RHF to update form state
                        onChange={handleReceiptChange} // Custom onChange for additional logic like fileName
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-chart-5 file:text-popover hover:file:bg-chart-4"
                        aria-invalid={errors.receipt ? "true" : "false"}
                    />
                    <p className="mt-1 text-xs text-gray-500">{selectedFileName}</p>
                    {/* Type assertion for errors.receipt needed if it's a CustomError */}
                    {errors.receipt && <p className={errorTextStyle} role="alert">{errors.receipt.message as string}</p>}
                </div>

                {serverState?.message && (
                    <p className={`text-sm ${serverState.errors || !serverState.data ? 'text-red-600' : 'text-green-600'}`}>
                        {serverState.message}
                    </p>
                )}
                {serverState?.errors?.general && (
                    <p className={errorTextStyle}>{serverState.errors.general.join(', ')}</p>
                )}

                <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-chart-5 hover:bg-chart-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit Expense"}
                </button>
            </form>
        </div>
    );
}

