"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function CampaignsLayout({ children }: { children: Readonly<ReactNode> }) {
    const pathname = usePathname();
    const sections: { title: string, url: string; }[] = [
        { title: "Joined Campaigns", url: "/campaigns/joined" },
        { title: "DM Campaigns", url: "/campaigns/dm" },
        { title: "Public Campaigns", url: "/campaigns/public" },
    ];

    return <>
        <div className="flex justify-between p-2 items-center">
            <h2 className="text-3xl">Your Campaigns</h2>
            <Link className={ cn(buttonVariants()) } href="/campaigns/create">
                Create Campaign
            </Link>
        </div>
        <div className="mx-auto flex gap-2 mb-4">
            {/* Styles from shadcn/tabs */}
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                { sections.map(({ title, url }) => (
                    <Link
                        key={ title }
                        href={ url }
                        data-state={ pathname.startsWith(url) ? "active" : undefined }
                        className="light inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                        { title }
                    </Link>
                )) }
            </div>
            {/*Search Campaigns Button*/ }
            {/*<Link*/ }
            {/*    href="/campaigns/search"*/ }
            {/*    className={ cn(buttonVariants({ variant: "secondary" }), "text-muted-foreground") }*/ }
            {/*>*/ }
            {/*    <SearchIcon/>*/ }
            {/*</Link>*/ }
        </div>
        { children }
    </>;
}