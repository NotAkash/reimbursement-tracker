import Link from "next/link";

export default function RequestPanel() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-around p-4 sm:p-8 md:p-12">
            <Link href="/request-panel" className="w-full max-w-2xl space-y-8 bg-secondary p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl text-center font-bold sm:text-4xl">
                    Request Panel
                </h1>
                <p className="text-center">
                    Approve, Confirm or Reject expense requests from the team.
                    <br />
                </p>
            </Link>
            <Link href="/admin-panel" className="w-full max-w-2xl space-y-8 bg-secondary p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl text-center font-bold sm:text-4xl">
                    Analytics
                </h1>
                <p className="text-center">
                    Coming soon
                    <br />
                </p>
            </Link>
        </div>
    );
}