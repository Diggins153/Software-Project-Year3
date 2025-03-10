import CampaignCard from "@/components/CampaignCard";
import { buttonVariants } from "@/components/ui/button";
import query from "@/lib/database";
import { Campaign } from "@/types/Campaign";
import Link from "next/link";
import React from "react";

export default async function CampaignsPage() {
    // Explicitly alias columns using the names from your SQL.
    const cardData = await query<Campaign[]>(`
        SELECT
            c.id AS campaign_id,
            c.name AS campaign_name,
            c.created_at,
            c.signups_open,
            c.dungeon_master_id,
            c.max_players,
            c.banner,
            c.outline,
            u.display_name AS dungeon_master_name
        FROM campaign c
                 JOIN \`user\` u ON u.id = c.dungeon_master_id
        ORDER BY c.id ASC;
    `);

    return (
        <main className="p-6">
            <Link className={buttonVariants()} href="/campaigns/create">
                Create Campaign
            </Link>
            <div className="mt-6 grid grid-cols-2 gap-4">
                {cardData.map((campaign) => (
                    //@ts-ignore
                    <CampaignCard campaign={campaign} key={campaign.campaign_id} />
                ))}
            </div>
        </main>
    );
}
