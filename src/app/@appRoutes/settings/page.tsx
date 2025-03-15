import { auth, signIn } from "@/lib/auth";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user) {
        await signIn();
    }

    return <main className="p-1.5">
        <div>
            User:
        </div>
        <div>
            <pre className="w-full text-wrap">
                <code>
                    { JSON.stringify(session, undefined, " ") }
                </code>
            </pre>
        </div>
    </main>;
}
