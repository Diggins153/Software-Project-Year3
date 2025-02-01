import { auth, signIn } from "@/auth";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user) {
        await signIn();
    }

    return <div className="flex">
        <main className="main-content flex items-center justify-center min-h-screen">
            User: <br/>
            { JSON.stringify(session) }
        </main>
    </div>;
}
