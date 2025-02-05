export default async function NoLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return <div className="content h-dvh mr-0 mx-1.5 w-auto">
        { children }
    </div>;
}
