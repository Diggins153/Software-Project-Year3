import CampaignCard from "@/components/CampaignCard";
import query from "@/lib/database";
import { ensureSession } from "@/lib/utils";
import { Campaign } from "@/types/Campaign";
import Link from "next/link";

export default async function JoinedCampaignsPage() {
    const { user } = await ensureSession();
    const campaigns = await query<Campaign[]>(`
        SELECT c.*, u.display_name AS dungeon_master_name
        FROM campaign_characters cc
                 JOIN campaign c ON cc.campaign_id = c.id
                 JOIN \`user\` u ON u.id = c.dungeon_master_id
        WHERE cc.character_id IN (SELECT id FROM \`character\` WHERE owner_id = ?)
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