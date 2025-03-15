import CampaignCard from "@/components/campaigns/CampaignCard";
import query from "@/lib/database";
import { ensureSession } from "@/lib/utils";
import { Campaign } from "@/types/Campaign";
import Link from "next/link";
/**
 * JoinedCampaignsPage displays the list of campaigns that the current user has joined
 *
 * This page fetches all distinct campaigns where the current user owns at least one character
 * that is associated with a campaign via the campaign_characters table The campaigns are then
 * displayed in a responsive grid If no campaigns are found, an appropriate message is shown
 *
 * @returns {Promise<JSX.Element>} A React component rendering the joined campaigns.
 */
export default async function JoinedCampaignsPage() {
    const { user } = await ensureSession();
    const campaigns = await query<Campaign[]>(`
        SELECT DISTINCT c.*, u.display_name AS dungeon_master_name
        FROM campaign_characters cc
                 JOIN campaign c ON cc.campaign_id = c.id
                 JOIN \`user\` u ON u.id = c.dungeon_master_id
        WHERE cc.character_id IN (SELECT id FROM \`character\` WHERE owner_id = ?)
          AND cc.status = 'joined'
    `, user.id);


    return <main>
        { campaigns.length > 0
            ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                { campaigns.map((campaign) => (
                    <Link key={ campaign.id } href={ `/campaigns/${ campaign.id }` }>
                        <CampaignCard campaign={ campaign }/>
                    </Link>
                )) }
            </div>
            : <div className="flex justify-center mt-10">
                You haven't joined any campaigns yet
            </div>
        }
    </main>;
};