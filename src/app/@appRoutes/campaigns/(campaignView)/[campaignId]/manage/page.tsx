import CampaignActionsList from "@/components/campaigns/CampaignActionsList";
import CampaignForm from "@/components/campaigns/CampaignForm";
import InviteDialog from "@/components/campaigns/InviteDialog";
import ManageCampaignCharacters from "@/components/campaigns/ManageCampaignCharacters";
import TopBar from "@/components/TopBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import query from "@/lib/database";
import { CampaignFormSchema } from "@/lib/formSchemas";
import { ensureSession, generateCampaignInviteCode } from "@/lib/utils";
import { Campaign } from "@/types/Campaign";
import { CharacterStatus } from "@/types/CampaignCharacters";
import { Character } from "@/types/Character";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

export const metadata: Metadata = {
    title: "Manage Campaign",
};

/**
 * ManageCampaignPage is the main page component for managing a campaign
 * It displays the campaign form (for editing), the list of characters in the campaign
 * and the available campaign actions (e.g., transfer ownership, delete campaign, etc.)
 *
 * This component first ensures the current session and retrieves the campaign based on the provided
 * campaignId parameter. If the campaign is not found or the current user is not the Dungeon Master,
 * it will redirect or show a notFound page.
 *
 * @param {Object} props - The component props.
 * @param {Promise<{ campaignId: number }>} props.params - A promise resolving to an object containing the campaignId.
 * @returns {Promise<JSX.Element>} A React component that renders the campaign management page.
 */
export default async function ManageCampaignPage({ params }: { params: Promise<{ campaignId: number }> }) {
    const session = await ensureSession();
    const { campaignId } = await params;
    const campaign = (await query<Campaign[]>("SELECT * FROM campaign WHERE id = ?", campaignId))[0] ?? null;
    if (!campaign) notFound();
    if (campaign.dungeon_master_id.toString() !== session.user.id) redirect(`/campaigns/view?campaignId=${ campaignId }`);
    const characters = await query<(Character & { owner_name: string, status: CharacterStatus })[]>(
        "SELECT c.*, u.display_name AS owner_name, campaign_characters.status FROM campaign_characters JOIN `character` c ON character_id = c.id JOIN user u ON c.owner_id = u.id WHERE campaign_id = ?",
        campaignId,
    );
    const formData: z.infer<typeof CampaignFormSchema> = {
        name: campaign.name,
        maxPlayers: campaign.max_players,
        outline: campaign.outline,
        signupsOpen: campaign.signups_open,
        isPublic: campaign.public,
        banner: campaign.banner,
    };

    if (!campaign.invite) {
        const code = generateCampaignInviteCode();
        await query("UPDATE campaign SET invite = ? WHERE id = ?", code, campaignId);
        campaign.invite = code;
    }

    function capitalize(string: string) {
        return string[0].toUpperCase() + string.substring(1);
    }

    return <main className="content">
        <TopBar
            title={ "Manage" }
            backText={ campaign.name }
            backLink={ `/campaigns/${ campaignId }` }
            endContent={ <InviteDialog inviteCode={ campaign.invite } campaignId={ campaignId }/> }
        />
        <div className="w-full md:w-1/2 mx-auto space-y-8">
            <div>
                <CampaignForm formData={ formData } asEditForm campaignId={ campaignId }/>
            </div>
            <div className="space-y-2">
                <h2 className="text-xl">Characters</h2>
                { characters.length > 0 ?
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead>Character</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { characters.map(character =>
                                <TableRow key={ character.id }>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={ character.image }/>
                                            <AvatarFallback>{ character.name[0] }</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{ character.name }</TableCell>
                                    <TableCell>{ character.owner_name }</TableCell>
                                    <TableCell>{ capitalize(character.status) }</TableCell>
                                    <TableCell className="text-right">
                                        <ManageCampaignCharacters
                                            status={ character.status }
                                            character={ character as Character }
                                            campaignId={ campaignId }
                                        />
                                    </TableCell>
                                </TableRow>,
                            ) }
                        </TableBody>
                    </Table>
                    :
                    <p>You don't have any characters in your campaign. Time to invite some!</p>
                }
            </div>
            <div>
                <h2 className="text-xl mb-4">Campaign Actions</h2>
                <CampaignActionsList campaignId={ campaignId }/>
            </div>
        </div>
    </main>;
};
