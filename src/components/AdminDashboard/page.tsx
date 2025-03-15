"use client";

import { buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { banUser, ignoreReport, removeContent } from "@/lib/actions/reports";
import { getReasons, type Report } from "@/types/Report";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

type RaceUsage = {
    name: string;
    usage_count: number;
};

type ClassUsage = {
    name: string;
    usage_count: number;
};

type Campaign = {
    id: number;
    name: string;
    dungeon_master_name: string;
};

type UserInfo = {
    id: number;
    display_name: string;
    email: string;
    // You can add a field for the user's characters if available.
};

type AdminDashboardProps = {
    mostUsedRaces: RaceUsage[];
    leastUsedRaces: RaceUsage[];
    mostUsedClasses: ClassUsage[];
    leastUsedClasses: ClassUsage[];
    campaigns: Campaign[];
    users: UserInfo[];
    reports: Report[];
};

export default function AdminDashboardClient({
                                                 mostUsedRaces,
                                                 leastUsedRaces,
                                                 mostUsedClasses,
                                                 leastUsedClasses,
                                                 campaigns,
                                                 users,
                                                 reports,
                                             }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState("statistics");
    const router = useRouter();

    async function handleRemoveContent(reportId: number) {
        const response = await removeContent(reportId);

        if (response.ok) {
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
    }

    // async function handleRemovePart(reportId: number) {
    //     const response = await removePart(reportId);
    // }

    async function handleBanUser(reportId: number) {
        const response = await banUser(reportId);

        if (response.ok) {
            toast.success("User was banned");
        } else {
            toast.error(response.message);
        }
    }

    async function handleIgnoreReport(reportId: number) {
        const response = await ignoreReport(reportId);

        if (response) {
            toast.success("Report Ignored");
            router.refresh();
        } else toast.error("Error in Ignoring report");
    }

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
                    <li>
                        <button
                            onClick={() => setActiveTab("reports")}
                            className={`px-4 py-2 font-semibold rounded transition-colors ${
                                activeTab === "reports"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                        >
                            Reports
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Content Sections */}
            {activeTab === "statistics" && (
                <section className="mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-center">
                        Usage Statistics
                    </h2>
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
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Campaign Name</th>
                                <th className="border px-4 py-2">Dungeon Master</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {campaigns.map((campaign: Campaign) => (
                                <tr key={campaign.id}>
                                    <td className="border px-4 py-2 text-center">{campaign.id}</td>
                                    <td className="border px-4 py-2">{campaign.name}</td>
                                    <td className="border px-4 py-2">{campaign.dungeon_master_name}</td>
                                    <td className="border px-4 py-2 text-center">
                                        <details className="inline-block">
                                            <summary className="cursor-pointer px-2 py-1 bg-gray-200 rounded text-black">
                                                Actions
                                            </summary>
                                            <ul className="mt-1 bg-white border rounded shadow">
                                                <li className="px-4 py-2 hover:bg-gray-100 text-black">Edit</li>
                                                <li className="px-4 py-2 hover:bg-gray-100 text-black">View</li>
                                                <li className="px-4 py-2 hover:bg-gray-100 text-black">Delete</li>
                                            </ul>
                                        </details>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {activeTab === "users" && (
                <section className="mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-center">User List</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Display Name</th>
                                <th className="border px-4 py-2">Email</th>
                                <th className="border px-4 py-2">Characters</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user: UserInfo) => (
                                <tr key={user.id}>
                                    <td className="border px-4 py-2 text-center">{user.id}</td>
                                    <td className="border px-4 py-2">{user.display_name}</td>
                                    <td className="border px-4 py-2">{user.email}</td>
                                    <td className="border px-4 py-2 text-center">
                                        <details className="inline-block">
                                            <summary className="cursor-pointer px-2 py-1 bg-gray-200 rounded text-black">
                                                Characters
                                            </summary>
                                            <ul className="mt-1 bg-white border rounded shadow">
                                                {/* Replace with actual user character data */}
                                                <li className="px-4 py-2 hover:bg-gray-100 text-black">
                                                    [User's Characters]
                                                </li>
                                            </ul>
                                        </details>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {activeTab === "reports" && (
                <section className="mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-center">Report List</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Content Type</th>
                                <th className="border px-4 py-2">Content ID</th>
                                <th className="border px-4 py-2">Reason</th>
                                <th className="border px-4 py-2">User Description</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {reports.map((report: Report) => (
                                <tr key={report.id}>
                                    <td className="border px-4 py-2 text-center">{report.id}</td>
                                    <td className="border px-4 py-2">{report.content_type}</td>
                                    <td className="border px-4 py-2 text-center">{report.content_id}</td>
                                    <td className="border px-4 py-2">
                                        { getReasons(report.content_type)[report.reason] }
                                    </td>
                                    <td className="border px-4 py-2">
                                        {report.user_description || "N/A"}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className={ buttonVariants() }>
                                                Actions
                                                <ChevronDown/>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem
                                                    onSelect={ () => handleRemoveContent(report.id) }
                                                >
                                                    Delete { report.content_type }
                                                </DropdownMenuItem>
                                                {/*<DropdownMenuItem*/}
                                                {/*    onSelect={ () => handleRemovePart(report.id) }*/}
                                                {/*>*/}
                                                {/*    Remove Offensive Part*/}
                                                {/*</DropdownMenuItem>*/}
                                                <DropdownMenuItem
                                                    onSelect={ () => handleBanUser(report.id) }
                                                >
                                                    Ban User
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={() => handleIgnoreReport(report.id)}
                                                >
                                                    Ignore Report
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
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