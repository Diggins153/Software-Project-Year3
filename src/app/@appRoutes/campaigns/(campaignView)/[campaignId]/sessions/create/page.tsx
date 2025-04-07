import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import query from "@/lib/database";
import CreateSessionForm from "@/components/sessions/CreateSessionForm";

type SessionCreatePageProps = {
    params: Promise<{ campaignId: number }>;
};

type DungeonMasterRow = {
    dungeon_master_id: number;
};

/**
 * SessionCreatePage renders the page for creating a new session for a specific campaign
 *
 * This page ensures that:
 * - The user is authenticated
 * - The campaign exists
 * - The current user is the Dungeon Master (DM) of the campaign
 *
 * If any of these conditions fail the user is redirected to the /campaigns page
 * Otherwise the page displays a form (CreateSessionForm) to create a new session for the campaign
 *
 * @param {SessionCreatePageProps} props  The component props
 * @returns {Promise<JSX.Element>} A React component that renders the session creation form
 */
export default async function SessionCreatePage({ params }: SessionCreatePageProps) {
    const session = await auth();
    const { campaignId } = await params;

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
        <main className="content p-6">
            <h1 className="text-3xl font-bold mb-4">Create Session for Campaign {campaignId}</h1>
            <CreateSessionForm campaignId={campaignId} />
        </main>
    );
}
