import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "BeyonD&D",
    // title: {
    //     template: "%s ⩿ BD&D",
    //     default: "BeyonD&D",
    // },
};

export default async function AppLayout({ children }: Readonly<{ children: ReactNode; }>) {
    return <>
        <Sidebar/>
        { children }
    </>;
}
