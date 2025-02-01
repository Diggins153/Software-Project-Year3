import React from 'react';
import Card from '@/components/Card';
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
            {cardData.map(campaign => <Card {...campaign}/>)}
        </div>
    );
};

export default Page;

