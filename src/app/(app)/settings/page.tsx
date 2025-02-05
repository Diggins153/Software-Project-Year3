import { auth, signIn } from "@/auth";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user) {
        await signIn();
    }

    return <main>
        User: <br/>
        { JSON.stringify(session) }
    </main>;
}
