import { auth, signIn } from "@/auth";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

export default async function AppLayout({ children }: Readonly<{ children: ReactNode; }>) {
    const session = await auth();
    if (!session?.user) {
        await signIn();
    }

    return <div className="flex">
        {/* Sidebar on the left */ }
        <Sidebar/>
        {/* Main content */ }
        <div className="content">
            { children }
        </div>
    </div>;
}
