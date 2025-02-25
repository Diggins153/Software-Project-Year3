import CampaignCard from "@/components/CampaignCard";
import React from "react";

// Note: Tempfix before Campaign entity is implemented
// TODO: Use ORM
export default async function CampaignsPage() {
    const cardData: any[] = [];

    return (
        <main>
            <div>
                { cardData.map(campaign => <CampaignCard { ...campaign } key={ campaign.id }/>) }
            </div>
        </main>
    );
};
