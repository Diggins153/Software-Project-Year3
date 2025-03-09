// app/campaigns/view/page.tsx
import { redirect } from "next/navigation";
import query from "@/lib/database";
import Link from "next/link";

type Campaign = {
    id: number;
    name: string;
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
    const campaignId = searchParams.campaignId;
    if (!campaignId) {
        redirect("/campaigns");
    }

    // Query the campaign by its id.
    const campaigns = await query<Campaign[]>(
        `SELECT 
         c.*,
         u.display_name AS dungeon_master_name
     FROM campaign c 
     JOIN \`user\` u ON u.id = c.dungeon_master_id 
     WHERE c.id = ?`,
        [campaignId]
    );

    const campaign = campaigns[0];
    if (!campaign) {
        redirect("/campaigns");
    }

    return (
        <main className="p-6">
            <h1 className="text-6xl font-bold text-center mb-8">{campaign.name}</h1>
            <div className="max-w-3xl mx-auto space-y-4 text-lg">
                <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(campaign.created_at).toLocaleDateString("en-US")}
                </p>
                <p>
                    <strong>Dungeon Master:</strong> {campaign.dungeon_master_name}
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
                        alt={`${campaign.name} Banner`}
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
