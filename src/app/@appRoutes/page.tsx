import CampaignCard from "@/components/campaigns/CampaignCard";
import TopBar from "@/components/TopBar";
import query from "@/lib/database";
import { ensureSession } from "@/lib/utils";
import { Campaign } from "@/types/Campaign";
import { Session } from "@/types/Session";
import Link from "next/link";

export default async function AuthenticatedHome() {
    const { user } = await ensureSession();
    const yourCampaigns = await query<Campaign[]>(`
        SELECT DISTINCT c.*, u.display_name AS dungeon_master_name
        FROM campaign_characters cc
                 JOIN campaign c ON cc.campaign_id = c.id
                 JOIN \`user\` u ON u.id = c.dungeon_master_id
        WHERE cc.character_id IN (SELECT id FROM \`character\` WHERE owner_id = ?)
          AND cc.status = 'joined'
    `, user.id);
    const upcomingSessions = await query<Session[]>(`
        SELECT s.*
        FROM session s
        WHERE s.campaign_id IN (SELECT cc.campaign_id
                                FROM campaign_characters cc
                                WHERE cc.character_id IN (SELECT id FROM \`character\` WHERE owner_id = ?))
          AND s.session_date > now()
        ORDER BY s.session_date
    `, user.id);

    return <main className="content">
        <TopBar title={ `Welcome, ${ user.display_name }` }/>
        <div className="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 mx-auto p-1.5 space-y-6">
            <YourCampaigns campaigns={ yourCampaigns }/>
            <UpcomingSessions sessions={ upcomingSessions }/>
        </div>
    </main>;
}

function YourCampaigns({ campaigns }: { campaigns: Campaign[] }) {
    return <div>
        <h2 className="text-2xl font-bold mb-2">Your campaigns</h2>
        { campaigns.length == 0 &&
            <p className="text-gray-400">You're not playing in any campaigns (yet)</p>
        }
        { campaigns.map(campaign =>
            <Link key={ campaign.id } href={ `/campaigns/${ campaign.id }` }>
                <CampaignCard campaign={ campaign }/>
            </Link>,
        ) }
    </div>;
}

function UpcomingSessions({ sessions }: { sessions: Session[] }) {
    return <div>
        <h2 className="text-2xl font-bold mb-2">Upcoming Sessions</h2>
        { sessions.length == 0 &&
            <p className="text-gray-400">No planned sessions</p>
        }
        { sessions.map(session => (
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
    </div>;
}
