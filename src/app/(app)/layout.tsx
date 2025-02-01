import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <Sidebar /> {/* Sidebar on the left */}
            <main className="content">{children}</main> {/* Main content */}
        </>
    );
}
