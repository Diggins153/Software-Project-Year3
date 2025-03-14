import CampaignCard from "@/components/CampaignCard";
import CharacterCard from "@/components/characters/CharacterCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import query from "@/lib/database";
import { ensureSession } from "@/lib/utils";
import { Campaign } from "@/types/Campaign";
import { Character } from "@/types/Character";
import { CircleHelpIcon } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function InvitePage({ params }: { params: Promise<{ inviteCode: string }> }) {
    const { user } = await ensureSession();
    const { inviteCode } = await params;
    const campaign = (await query<Campaign[]>("SELECT * FROM campaign WHERE invite = ?", inviteCode))[0] || null;
    if (campaign == null || !campaign) redirect("/campaigns");
    const characterCount = (await query<{ count: number }[]>(
        "SELECT count(character_id) AS count FROM campaign_characters WHERE campaign_id = ?",
        campaign!.id,
    ))[0].count;
    const characters = await query<Character[]>(
        "SELECT * FROM `character` WHERE owner_id = ? AND id NOT IN (SELECT character_id FROM campaign_characters WHERE campaign_id = ? AND status NOT IN ('kicked'))",
        user.id, campaign!.id);

    async function addCharacter(character: Character) {
        "use server";
        const campaignUrl = `/campaigns/view?campaignId=${ campaign!.id }`;
        await query("INSERT INTO campaign_characters (campaign_id, character_id, status) VALUE (?, ?, 'joined') ON DUPLICATE KEY UPDATE status = 'joined'", campaign!.id, character.id);
        revalidatePath("/campaigns");
        revalidatePath(campaignUrl);
        redirect(campaignUrl);
    }

    if (!campaign!.signups_open) {
        return <main className="h-full flex flex-col items-center justify-center gap-4">
            <CampaignCard campaign={ campaign }/>
            <h3 className="text-xl font-bold">Signups for this campaigns have closed.</h3>
            <p>If you wish to join, contact the DM so they can increase the player size.</p>
            <Link href="/campaigns" className={ buttonVariants({ variant: "default" }) }>Go back to campaigns</Link>
        </main>;
    }

    if (characterCount >= campaign!.max_players) {
        return <main className="h-full flex flex-col items-center justify-center gap-4">
            <CampaignCard campaign={ campaign }/>
            <h3 className="text-xl font-bold">This campaign is full.</h3>
            <p>If you wish to join, contact the DM so they can increase the player size.</p>
            <Link href="/campaigns" className={ buttonVariants({ variant: "default" }) }>Go back to campaigns</Link>
        </main>;
    }

    return <main className="space-y-4 pt-2 px-2">
        <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold">You are invited to</h3>
            <CampaignCard campaign={ campaign }/>
        </div>
        <div className="flex items-center gap-2">
            Choose a character to join with
            <TooltipProvider delayDuration={ 0 } disableHoverableContent>
                <Tooltip>
                    <TooltipTrigger type="button"><CircleHelpIcon size={ 20 }/></TooltipTrigger>
                    <TooltipContent>Excludes banned or already joined characters</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <div className="flex flex-wrap w-full">
            { characters.map(character =>
                <form
                    className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    key={ character.id } action={ async () => {
                    "use server";
                    await addCharacter(character);
                } }
                >
                    <Button type="submit" className="h-min w-full px-2 rounded-xl" variant="ghost">
                        <CharacterCard character={ character }/>
                    </Button>
                </form>,
            ) }
        </div>
    </main>;
}
