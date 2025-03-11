"use server";

import { auth } from "@/lib/auth";
import query from "@/lib/database";
import { CampaignFormSchema } from "@/lib/formSchemas";
import { generateCampaignInviteCode } from "@/lib/utils";
import { z } from "zod";

export async function createCampaign(formValues: z.infer<typeof CampaignFormSchema>): Promise<
    { ok: false, message?: string } |
    { ok: false, errors: z.inferFormattedError<typeof CampaignFormSchema> } |
    { ok: true, message: string, redirect: string }
> {
    const session = await auth();
    if (!session || !session.user) {
        return { ok: false, message: "Something went wrong." };
    }
    const parseResult = CampaignFormSchema.safeParse(formValues);

    if (!parseResult.success) return { ok: false, errors: parseResult.error.format() };

    const { name, banner, outline, maxPlayers, signupsOpen } = parseResult.data;

    // TODO: Upload banner to blob storage
    // TODO: Set banner in query

    await query(
        "INSERT INTO campaign (name, dungeon_master_id, signups_open, max_players, banner, outline) VALUE (?, ?, ?, ?, 'https://placehold.co/720/200', ?)",
        name, session.user.id, signupsOpen, maxPlayers, outline);

    return { ok: true, message: `${ name } created.`, redirect: "/campaigns" };
}

export async function regenerateInviteCode(campaignId: number): Promise<{ ok: boolean }> {
    const session = await auth();
    const campaign = (await query<{ dungeon_master_id: number }[]>(
        "SELECT dungeon_master_id FROM campaign WHERE id = ?", campaignId,
    ))[0] || null;

    if (!session || !session.user || !campaign || session.user.id !== campaign.dungeon_master_id.toString()) {
        return { ok: false };
    }

    const newCode = generateCampaignInviteCode();

    await query("UPDATE campaign SET invite = ? WHERE id = ?", newCode, campaignId);
    return { ok: true };
}