import { auth, signIn } from "@/auth";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user) {
        await signIn();
    }

    return <main>
        User: <br/>
        <pre>
            <code>
                { JSON.stringify(session) }
            </code>
        </pre>
    </main>;
}
