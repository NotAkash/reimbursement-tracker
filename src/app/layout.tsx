import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "COMPSA Reimbursement Form",
    description: "A next.js app for submitting reimbursement requests",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <div>
                    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                        <div className="flex items-center justify-between space-y-2">
                            <div>
                                <a href="https://compsa.ca/logo.svg"></a>
                                <h1 className="text-4xl font-bold mb-6">Expense Reimbursement</h1>
                            </div>
                            <div className="flex items-center space-x-2">
                                <h1>Admin Login</h1>
                            </div>
                        </div>
                    </div>
                </div>
                {children}
            </body>
        </html>
    );
}
