import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import query from "@/lib/database";
import CreateSessionForm from "@/components/sessions/CreateSessionForm";

type SessionCreatePageProps = {
    searchParams: Promise<{ campaignId?: string }>;
};

type DungeonMasterRow = {
    dungeon_master_id: number;
};

export default async function SessionCreatePage({ searchParams }: SessionCreatePageProps) {
    const session = await auth();
    const cId = (await searchParams).campaignId;
    if (!cId) {
        redirect("/campaigns");
    }

    // Convert the campaignId to a number
    const campaignId = Number(cId);
    if (isNaN(campaignId)) {
        redirect("/campaigns");
    }

    // Make sure campaign exists and that user is the DM
    const campaigns = await query<DungeonMasterRow[]>(
        `
            SELECT dungeon_master_id
            FROM campaign
            WHERE id = ?
        `,
        [campaignId]
    );

    if (!campaigns.length) {
        redirect("/campaigns");
    }

    const campaign = campaigns[0];
    if (!session?.user || campaign.dungeon_master_id.toString() !== session.user.id) {
        redirect("/campaigns");
    }

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-4">Create Session for Campaign {campaignId}</h1>
            <CreateSessionForm campaignId={campaignId} />
        </main>
    );
}
