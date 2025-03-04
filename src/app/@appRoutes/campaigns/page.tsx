import CampaignCard from "@/components/CampaignCard";
import { buttonVariants } from "@/components/ui/button";
import { Campaign } from "@/entities/Campaign";
import getORM from "@/lib/orm";
import Link from "next/link";
import React from "react";

export default async function CampaignsPage() {
    const campaignsRepo = (await getORM()).getRepository(Campaign);
    const cardData = await campaignsRepo.findAll({ populate: [ "dungeonMaster" ] });

    return (
        <main>
            <Link className={ buttonVariants() } href="/campaigns/create">Create Campaign</Link>
            <div>
                { cardData.map(campaign => <CampaignCard campaign={ campaign } key={ campaign.id }/>) }
            </div>
        </main>
    );
};
