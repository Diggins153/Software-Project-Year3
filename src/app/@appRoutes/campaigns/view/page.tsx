// app/campaigns/view/page.tsx
import { redirect } from "next/navigation";
import query from "@/lib/database";
import Link from "next/link";
import { auth } from "@/lib/auth";

type Campaign = {
    campaign_id: number;
    campaign_name: string;
    created_at: string;
    updated_at: string;
    signups_open: number;
    dungeon_master_id: number;
    max_players: number;
    banner: string;
    outline: string;
    dungeon_master_name: string;
};

type Session = {
    id: number;
    title: string;
    excerpt: string | null;
    writeup: string | null;
    session_date: string;
    signup_deadline: string;
};

type CampaignViewPageProps = {
    searchParams: { campaignId?: string };
};

export default async function CampaignViewPage({ searchParams }: CampaignViewPageProps) {
    const session = await auth();
    const campaignId = searchParams.campaignId;
    if (!campaignId) {
        redirect("/campaigns");
    }

    // Query the campaign by its id using proper aliases.
    const campaigns = await query<Campaign[]>(`
        SELECT
            c.id AS campaign_id,
            c.name AS campaign_name,
            c.created_at,
            c.updated_at,
            c.signups_open,
            c.dungeon_master_id,
            c.max_players,
            c.banner,
            c.outline,
            u.display_name AS dungeon_master_name
        FROM campaign c
                 JOIN \`user\` u ON u.id = c.dungeon_master_id
        WHERE c.id = ?
    `, [campaignId]);

    const campaign = campaigns[0];
    if (!campaign) {
        redirect("/campaigns");
    }

    // Check if the current user is the owner (dungeon master) of the campaign.
    const currUserIsOwner =
        session &&
        session.user &&
        campaign.dungeon_master_id.toString() === session.user.id;

    // Query sessions for this campaign.
    const sessions = await query<Session[]>(`
    SELECT id, title, excerpt, writeup, session_date, signup_deadline
    FROM session
    WHERE campaign_id = ?
    ORDER BY session_date ASC
  `, [campaign.campaign_id]);

    return (
        <main className="p-6">
            {/* DM-only controls */}
            {currUserIsOwner && (
                <div className="flex justify-end mb-4 gap-2">
                    <Link
                        href={`/campaigns/edit?campaignId=${campaign.campaign_id}`}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Edit Campaign
                    </Link>
                    <Link
                        href={`/campaigns/session/create?campaignId=${campaign.campaign_id}`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Create Session
                    </Link>
                </div>
            )}

            {/* Campaign details */}
            <h1 className="text-6xl font-bold text-center mb-8">
                {campaign.campaign_name}
            </h1>
            <div className="max-w-3xl mx-auto space-y-4 text-lg">
                <p>
                    <strong>Dungeon Master:</strong> {campaign.dungeon_master_name}
                </p>
                <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(campaign.created_at).toLocaleDateString("en-US")}
                </p>
                <p>
                    <strong>Max Players:</strong> {campaign.max_players}
                </p>
                <p>
                    <strong>Signups Open:</strong> {campaign.signups_open ? "Yes" : "No"}
                </p>
                <p>
                    <strong>Outline:</strong> {campaign.outline}
                </p>
                {campaign.banner && (
                    <img
                        src={campaign.banner}
                        alt={`${campaign.campaign_name} Banner`}
                        className="w-full h-auto mt-4"
                    />
                )}
            </div>

            {/* Sessions Section */}
            <div className="mt-8">
                <h2 className="text-3xl font-semibold text-center mb-4">Upcoming Sessions</h2>
                {sessions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {sessions.map((session) => (
                            <div key={session.id} className="border p-4 rounded shadow hover:shadow-lg">
                                <h3 className="text-2xl font-bold">{session.title}</h3>
                                <p className="text-gray-600">
                                    <strong>Date:</strong> {new Date(session.session_date).toLocaleString("en-US")}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Signup Deadline:</strong> {new Date(session.signup_deadline).toLocaleString("en-US")}
                                </p>
                                {session.excerpt && (
                                    <p className="mt-2">{session.excerpt}</p>
                                )}
                                {session.writeup && (
                                    <p className="mt-2 text-sm text-gray-500">{session.writeup}</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No sessions have been scheduled for this campaign.</p>
                )}
            </div>

            {/* Back link */}
            <div className="mt-8 text-center">
                <Link
                    href="/campaigns"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Back to Campaigns
                </Link>
            </div>
        </main>
    );
}
