"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { aggregateExpenses, pickEvents } from "@/actions/read-expense"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import type { Record } from "@/types/records"
import React from "react"


export async function fetchChartData() {
    const response = await aggregateExpenses()
    if (response.success) {
        console.log("Chart data fetched successfully:", response.data)
        return response.data as { [key: string]: number }
    } else {
        console.error("Failed to fetch chart data:", response.message)
        return []
    }
}

const chartConfig = {
    Events: {
        label: "Events",
        color: "#2563eb",
    },
    value: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig

export function DataChart() {
    const [data, setData] = React.useState<{ name: string; value: number; }[]>([]);
    React.useEffect(() => {
        fetchChartData().then((chartData) => {
            // Transform the data into the format expected by BarChart
            const transformedData = Object.entries(chartData).map(([key, value]) => ({
                name: key,
                value,
            }));
            setData(transformedData);
        });
    }, []);

    return (
        <ChartContainer config={chartConfig} className="min-h-[400px] w-full p-4 sm:p-6">
            <BarChart accessibilityLayer data={data} margin={{ top: 10, right: 30, left: 20, bottom: 15 }}>
                <XAxis
                    dataKey="name"
                    tickLine={true}
                    axisLine={false}
                    tick={{ fill: "var(--color-text)" }}
                    tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 10)}...` : value}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    style={{ fontSize: "0.8rem", fill: "var(--color-text)" }}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--color-card)" }}
                    style={{ fontSize: "0.8rem", fill: "var(--color-text)" }}
                />
                <Bar dataKey="value" fill="var(--color-desktop)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}
