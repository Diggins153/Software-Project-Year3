"use client";

import { useState } from "react";
import Link from "next/link";

type RaceUsage = {
    name: string;
    usage_count: number;
};

type ClassUsage = {
    name: string;
    usage_count: number;
};

type AdminDashboardProps = {
    mostUsedRaces: RaceUsage[];
    leastUsedRaces: RaceUsage[];
    mostUsedClasses: ClassUsage[];
    leastUsedClasses: ClassUsage[];
};

export default function AdminDashboardClient({
                                                 mostUsedRaces,
                                                 leastUsedRaces,
                                                 mostUsedClasses,
                                                 leastUsedClasses,
                                             }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState("statistics");

    return (
        <main className="p-6">
            {/* Navbar */}
            <nav className="mb-8 border-b pb-4">
                <ul className="flex justify-center space-x-6">
                    <li>
                        <button
                            onClick={() => setActiveTab("statistics")}
                            className={`px-4 py-2 font-semibold rounded transition-colors ${
                                activeTab === "statistics"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                        >
                            Statistics
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab("campaigns")}
                            className={`px-4 py-2 font-semibold rounded transition-colors ${
                                activeTab === "campaigns"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                        >
                            Campaigns
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`px-4 py-2 font-semibold rounded transition-colors ${
                                activeTab === "users"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                        >
                            Users
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Content Sections */}
            {activeTab === "statistics" && (
                <section className="mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-center">Usage Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-semibold mb-2 text-center">
                                Most Used Races
                            </h3>
                            <table className="min-w-full border-collapse">
                                <thead>
                                <tr>
                                    <th className="border px-4 py-2">Race</th>
                                    <th className="border px-4 py-2">Usage Count</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mostUsedRaces.map((race) => (
                                    <tr key={race.name}>
                                        <td className="border px-4 py-2">{race.name}</td>
                                        <td className="border px-4 py-2 text-center">
                                            {race.usage_count}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-2 text-center">
                                Least Used Races
                            </h3>
                            <table className="min-w-full border-collapse">
                                <thead>
                                <tr>
                                    <th className="border px-4 py-2">Race</th>
                                    <th className="border px-4 py-2">Usage Count</th>
                                </tr>
                                </thead>
                                <tbody>
                                {leastUsedRaces.map((race) => (
                                    <tr key={race.name}>
                                        <td className="border px-4 py-2">{race.name}</td>
                                        <td className="border px-4 py-2 text-center">
                                            {race.usage_count}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-2 text-center">
                                Most Used Classes
                            </h3>
                            <table className="min-w-full border-collapse">
                                <thead>
                                <tr>
                                    <th className="border px-4 py-2">Class</th>
                                    <th className="border px-4 py-2">Usage Count</th>
                                </tr>
                                </thead>
                                <tbody>
                                {mostUsedClasses.map((cls) => (
                                    <tr key={cls.name}>
                                        <td className="border px-4 py-2">{cls.name}</td>
                                        <td className="border px-4 py-2 text-center">
                                            {cls.usage_count}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-2 text-center">
                                Least Used Classes
                            </h3>
                            <table className="min-w-full border-collapse">
                                <thead>
                                <tr>
                                    <th className="border px-4 py-2">Class</th>
                                    <th className="border px-4 py-2">Usage Count</th>
                                </tr>
                                </thead>
                                <tbody>
                                {leastUsedClasses.map((cls) => (
                                    <tr key={cls.name}>
                                        <td className="border px-4 py-2">{cls.name}</td>
                                        <td className="border px-4 py-2 text-center">
                                            {cls.usage_count}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {activeTab === "campaigns" && (
                <section className="mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-center">Campaign List</h2>
                    <p className="text-center">You are viewing the Campaigns section.</p>
                </section>
            )}

            {activeTab === "users" && (
                <section className="mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-center">User List</h2>
                    <p className="text-center">You are viewing the Users section.</p>
                </section>
            )}

            <div className="mt-8 text-center">
                <Link
                    href="/"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </main>
    );
}
