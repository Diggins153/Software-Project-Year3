import CampaignCard from "@/components/CampaignCard";
import { buttonVariants } from "@/components/ui/button";
import query from "@/lib/database";
import { Campaign } from "@/types/Campaign";
import Link from "next/link";
import React from "react";

export default async function CampaignsPage() {
    const cardData = await query<Campaign[]>("SELECT *, u.display_name as dungeon_master_name FROM campaign JOIN user u ON u.id = dungeon_master_id;")

    return (
        <main>
            <Link className={ buttonVariants() } href="/campaigns/create">Create Campaign</Link>
            <div>
                { cardData.map(campaign => <CampaignCard campaign={ campaign } key={ campaign.id }/>) }
            </div>
        </main>
    );
};
