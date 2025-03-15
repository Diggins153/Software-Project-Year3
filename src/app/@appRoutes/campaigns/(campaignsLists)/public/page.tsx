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
        WHERE c.public = TRUE
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
                There aren't any public campaigns
            </div>
        }
    </main>;
}