import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

export default async function AppLayout({ children }: Readonly<{ children: ReactNode; }>) {
    return <div className="flex">
        <Sidebar/>
        <div className="content">
            { children }
        </div>
    </div>;
}
