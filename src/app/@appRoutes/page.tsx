import query from "@/lib/database";
import { ensureSession } from "@/lib/utils";
import { Session } from "@/types/Session";
import Link from "next/link";

export default async function AuthenticatedHome() {
    const { user } = await ensureSession();
    const upcomingSessions = await query<Session[]>(`
        SELECT s.*
        FROM session s
        WHERE s.campaign_id IN (SELECT cc.campaign_id
                                FROM campaign_characters cc
                                WHERE cc.character_id IN (SELECT id FROM \`character\` WHERE owner_id = ?))
          AND s.session_date > now()
        ORDER BY s.session_date
    `, user.id);

    return <main>
        <div className="p-2 bg-theme mb-4">
            <h1 className="text-3xl font-bold">Welcome, { user.display_name }</h1>
        </div>
        <div className="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 mx-auto p-1.5">
            <div>
                <h2 className="text-2xl font-bold mb-2">Upcoming Sessions</h2>
                { upcomingSessions.map(session => (
                    <Link key={ session.id } href={ `/campaigns/${ session.campaign_id }` }>
                        <div className="py-2 px-3 rounded bg-yellow-200 text-black">
                            <h3 className="text-xl">{ session.title }</h3>
                            <p>
                                <strong>Date:</strong> { session.session_date.toLocaleString("en-UK") }
                            </p>
                            <p>
                                <strong>Signup Deadline:</strong> { session.signup_deadline.toLocaleString("en-UK") }
                            </p>
                            { session.excerpt && <p className="mt-2">{ session.excerpt }</p> }
                            { session.writeup && (
                                <p className="mt-2 text-sm text-gray-500">{ session.writeup }</p>
                            ) }
                        </div>
                    </Link>
                )) }
            </div>
        </div>
    </main>;
}
