import CampaignCard from "@/components/campaigns/CampaignCard";
import query from "@/lib/database";
import { ensureSession } from "@/lib/utils";
import { Campaign } from "@/types/Campaign";
import Link from "next/link";

export default async function DungeonMasterCampaignsPage() {
    const { user } = await ensureSession();
    const campaigns = await query<Campaign[]>(`
        SELECT c.*, u.display_name AS dungeon_master_name
        FROM campaign c
                 JOIN \`user\` u ON u.id = c.dungeon_master_id
        WHERE c.dungeon_master_id = ?
    `, user.id);


    /**
     * DungeonMasterCampaignsPage displays all campaigns created by the currently logged-in Dungeon Master
     *
     * This page fetches all campaigns from the database where the dungeon_master_id matches the current user's id
     * then displays them in a responsive grid. If no campaigns are found, a message is shown
     *
     * @returns {Promise<JSX.Element>} A React component rendering the Dungeon Master's campaigns.
     */
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
                You haven't created any campaigns yet
            </div>
        }
    </main>;
}