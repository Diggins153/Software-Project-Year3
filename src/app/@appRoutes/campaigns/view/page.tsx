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

type CampaignViewPageProps = {
    searchParams: { campaignId?: string };
};

export default async function CampaignViewPage({ searchParams }: CampaignViewPageProps) {
    const session = await auth();
    const campaignId = searchParams.campaignId;
    if (!campaignId) {
        redirect("/campaigns");
    }

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

    return (
        <main className="p-6">
            {/* If the current user is the DM, show Edit + Create Session buttons */}
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
                    <strong>Signups Open:</strong>{" "}
                    {campaign.signups_open ? "Yes" : "No"}
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
