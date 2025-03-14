"use server";

import { auth } from "@/lib/auth";
import query from "@/lib/database";
import { CampaignFormSchema, TransferOwnershipFormSchema } from "@/lib/formSchemas";
import { ensureSession, generateCampaignInviteCode } from "@/lib/utils";
import { Campaign } from "@/types/Campaign";
import { User } from "@/types/User";
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

export async function updateCampaign(campaignId: number, data: z.infer<typeof CampaignFormSchema>): Promise<
    { ok: false, message: string } |
    { ok: true }
> {
    const { user } = await ensureSession();
    const parseResult = CampaignFormSchema.safeParse(data);

    if (!parseResult.success) return { ok: false, message: "Please check all data is correct" };
    const { name, banner, outline, maxPlayers, signupsOpen } = parseResult.data;

    // Check campaign exists
    const campaign = (await query<Campaign[]>("SELECT * FROM campaign WHERE id = ?", campaignId))[0] || null;
    if (campaign == null) return { ok: false, message: "The campaign you're trying to update does not exist" };

    // Check owner
    if (campaign.dungeon_master_id.toString() !== user.id)
        return { ok: false, message: "You can only edit your own campaigns." };

    // Construct update
    const parametrizedKeys: string[] = [];
    const params = [];
    if (campaign.name !== name) {
        parametrizedKeys.push("name = ?");
        params.push(name);
    }
    // TODO: Banner
    if (campaign.outline !== outline) {
        parametrizedKeys.push("outline = ?");
        params.push(outline);
    }
    if (campaign.max_players !== maxPlayers) {
        parametrizedKeys.push("max_players = ?");
        params.push(maxPlayers);
    }
    if (campaign.signups_open !== signupsOpen) {
        parametrizedKeys.push("signups_open = ?");
        params.push(signupsOpen);
    }
    if (parametrizedKeys.length == 0) return { ok: true };
    let statement = `UPDATE campaign SET ${ parametrizedKeys.join(", ") } WHERE id = ?`;

    try {
        await query(statement, ...params, campaignId);
    } catch (e) {
        console.error("Error when updating character", e);
        return { ok: false, message: "Something went wrong" };
    }

    return { ok: true };
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

export async function transferOwnership(data: z.infer<typeof TransferOwnershipFormSchema>): Promise<
    { ok: true, message: string, redirectTo: string } |
    { ok: false, message: string }
> {
    const { user } = await ensureSession();
    const result = await TransferOwnershipFormSchema.safeParseAsync(data);
    if (!result.success) return { ok: false, message: "Please check form is valid" };

    const { campaignId, newOwnerEmail } = result.data;
    const campaign = (await query<Campaign[]>("SELECT dungeon_master_id FROM campaign WHERE id = ?", campaignId))[0];
    const newOwner = (await query<User[]>("SELECT id, display_name FROM user WHERE email = ?", newOwnerEmail))[0];
    if (campaign.dungeon_master_id.toString() !== user.id) return {
        ok: false,
        message: "You can only transfer your campaigns.",
    };
    await query("UPDATE campaign SET dungeon_master_id = ? WHERE id = ?", newOwner.id, campaignId);
    return {
        ok: true,
        message: `Ownership successfully transferred to ${ newOwner.display_name }`,
        redirectTo: "/campaigns",
    };
}