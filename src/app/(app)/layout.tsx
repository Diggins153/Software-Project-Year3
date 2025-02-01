import { auth, signIn } from "@/auth";
import Sidebar from "@/components/Sidebar";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const session = await auth();
    if (!session?.user) {
        await signIn();
    }

    return <>
        {/* Sidebar on the left */ }
        <Sidebar/>
        {/* Main content */ }
        <main className="content">{ children }</main>
    </>;
}
