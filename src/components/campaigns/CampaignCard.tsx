import query from "@/lib/database";
import { Campaign } from "@/types/Campaign";
import Image from "next/image";

/**
 * CampaignCard component displays campaign details including the next session date
 *
 * @param {{ campaign: Campaign }} props - The campaign object
 * @returns {JSX.Element} - The campaign card UI
 */
export default async function CampaignCard({ campaign }: { campaign: Campaign }) {
    const nextSessionDate = (await query<{ session_date?: Date }[]>(`
        SELECT session_date
        FROM session
        WHERE campaign_id = ?
        ORDER BY session_date
        LIMIT 1
    `, campaign.id))[0]?.session_date || null;

    return (
        <div className="bg-yellow-200 text-black rounded-lg overflow-clip">
            <div className="">
                { !!campaign.banner
                    ? <Image
                        src={ campaign.banner }
                        alt=""
                        width={ 1500 }
                        height={ 500 }
                        className="campaign-banner"
                    />
                    : <div className="aspect-[3/1] bg-white"></div>
                }
            </div>
            <div className="p-2 flex justify-between items-center">
                <div>
                    <h4 className="md:text-lg font-bold">{ campaign.name }</h4>
                    <p className="text-sm md:text-base">by { campaign.dungeon_master_name }</p>
                    <p>{ nextSessionDate != null
                        ? `Next: ${ nextSessionDate.toLocaleDateString("en-UK") }`
                        : "No session scheduled"
                    }</p>
                </div>
            </div>
        </div>
    );
}
