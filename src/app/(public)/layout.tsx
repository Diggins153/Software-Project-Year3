export default function NoLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            { children }
        </>
    );
}
