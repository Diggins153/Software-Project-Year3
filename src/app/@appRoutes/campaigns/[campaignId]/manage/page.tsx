import InviteDialog from "@/components/campaigns/InviteDialog";
import query from "@/lib/database";
import { ensureSession, generateCampaignInviteCode } from "@/lib/utils";
import { Campaign } from "@/types/Campaign";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Manage Campaign",
};

export default async function ManageCampaignPage({ params }: { params: Promise<{ campaignId: number }> }) {
    let session = await ensureSession();

    const { campaignId } = await params;
    const campaign = (await query<Campaign[]>("SELECT * FROM campaign WHERE id = ?", campaignId))[0] ?? null;
    if (!campaign) notFound();
    if (campaign.dungeon_master_id.toString() !== session.user.id) redirect(`/campaigns/view?campaignId=${ campaignId }`);

    if (!campaign.invite) {
        const code = generateCampaignInviteCode();
        await query("UPDATE campaign SET invite = ? WHERE id = ?", code, campaignId);
        campaign.invite = code;
    }

    return <main>
        <h1>Managing Campaign with ID { campaignId }</h1>
        <InviteDialog inviteCode={ campaign.invite } campaignId={ campaignId }/>
        <p>Table of users here</p>
        <p>Campaign Actions Here</p>
    </main>;
};