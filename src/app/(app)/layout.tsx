import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <Sidebar/>
            { children }
        </>
    );
}
