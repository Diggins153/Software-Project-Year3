import CampaignCard from "@/components/CampaignCard";
import { Campaign } from "@/entities/Campaign";
import getORM from "@/lib/orm";
import React from "react";

export default async function CampaignsPage() {
    const campaignsRepo = (await getORM()).getRepository(Campaign);
    const cardData = await campaignsRepo.findAll({ populate: [ "dungeonMaster" ] });

    return (
        <main>
            <div>
                { cardData.map(campaign => <CampaignCard campaign={ campaign } key={ campaign.id }/>) }
            </div>
        </main>
    );
};
