import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Link from "next/link";

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
    description: "Submitting reimbursement requests",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased text-card-foreground`}
            >
                <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex bg-secondary">
                    <div className="flex items-center justify-between space-y-2">
                        <div>
                                <Link className="text-4xl font-bold mb-6" href={"/"}>Expense Reimbursement</Link>
                        </div>
                        <div className="flex items-center space-x-2" >
                            <Link className="text-2xl font-bold mb-6" href="/admin-panel">Admin Panel</Link>
                        </div>
                    </div>
                </div>
                <div>{children}</div>
            </body>
        </html>
    );
}
