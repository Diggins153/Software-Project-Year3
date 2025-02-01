import React from 'react';
import CampaignCard from '@/components/CampaignCard';
import {db} from "@/lib/db";

async function fetchCardData() {
    const response = db('campaign').select('*');
    return (
        response
    )


}

const Page: React.FC = async () => {
    const cardData = await fetchCardData();
    console.log(cardData);
    return (
        <div>
            {cardData.map(campaign => <CampaignCard {...campaign} key={campaign.id}/>)}
        </div>
    );
};

export default Page;

