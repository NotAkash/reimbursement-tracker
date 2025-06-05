import React from 'react';

import { DataChart } from './data-chart';

export default function AnalyticsPage() {
    return (
        <div className="w-full flex flex-col items-center p-4 justify-between">
            <div className="max-w-2xl space-y-8 bg-secondary p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl text-center font-bold sm:text-4xl">
                    Analytics
                </h1>
                <p className="text-center">
                    Measure, Track, Analyse Organization Wide Expenses.
                    <br />
                </p>
            </div>
            <div className="max-w-4xl mt-8 bg-secondary p-2 rounded-lg shadow-lg w-full">
                <h2 className="text-2xl font-semibold mb-4">Expense Trends</h2>
                <DataChart />
            </div>
        </div>
    );
};