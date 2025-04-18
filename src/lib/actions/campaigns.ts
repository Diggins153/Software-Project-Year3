"use server";

import { auth } from "@/lib/auth";
import query from "@/lib/database";
import { CampaignFormSchema, TransferOwnershipFormSchema } from "@/lib/formSchemas";
import { ensureSession, generateCampaignInviteCode } from "@/lib/utils";
import { Campaign } from "@/types/Campaign";
import { Character } from "@/types/Character";
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
    const { name, banner, outline, maxPlayers, signupsOpen, isPublic } = parseResult.data;

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
    if (campaign.public !== isPublic) {
        parametrizedKeys.push("public = ?");
        params.push(isPublic);
    }
    if (parametrizedKeys.length == 0) return { ok: true };
    let statement = `UPDATE campaign
                     SET ${ parametrizedKeys.join(", ") }
                     WHERE id = ?`;

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

type CampaignRow = {
    id: number;
    name: string;
    dungeon_master_id: number;
};

export async function deleteCampaign(
    campaignId: number,
): Promise<{ ok: boolean; message: string; redirect?: string }> {
    // 1) Authenticate
    const session = await auth();
    if (!session?.user) {
        return { ok: false, message: "You are not logged in." };
    }

    // 2) Retrieve the campaign to ensure it exists and check ownership
    const [ campaign ] = await query<CampaignRow[]>(
        "SELECT * FROM campaign WHERE id = ?",
        [ campaignId ],
    );
    if (!campaign) {
        return { ok: false, message: "Campaign not found." };
    }

    // 3) Verify the user is the DM
    if (campaign.dungeon_master_id.toString() !== session.user.id) {
        return { ok: false, message: "You are not authorized to delete this campaign." };
    }

    // 4) Clean up related data (if you don’t have ON DELETE CASCADE)

    // 4a) Delete messages tied to this campaign
    await query("DELETE FROM messages WHERE campaign_id = ?", [ campaignId ]);

    // 4b) Delete from campaign_characters bridging table
    await query("DELETE FROM campaign_characters WHERE campaign_id = ?", [ campaignId ]);

    // 4c) Delete from session_characters
    //     (but first find all sessions for this campaign)
    //     We join session_characters (sc) to session (s) on session_id
    //     and delete only rows that belong to the campaign
    await query(`
        DELETE sc
        FROM session_characters sc
                 JOIN session s ON s.id = sc.session_id
        WHERE s.campaign_id = ?
    `, [ campaignId ]);

    // 4d) Delete sessions themselves
    await query("DELETE FROM session WHERE campaign_id = ?", [ campaignId ]);

    // 5) Finally, delete the campaign
    await query("DELETE FROM campaign WHERE id = ?", [ campaignId ]);

    // 6) Return success
    return {
        ok: true,
        message: `Campaign "${ campaign.name }" deleted successfully.`,
        redirect: "/campaigns",
    };
}

export async function leaveCampaign(campaignId: number) {
    const { user } = await ensureSession();
    const campaign = (await query<Campaign[]>(`
        SELECT *
        FROM campaign
        WHERE id = ?
    `, campaignId))[0] ?? null;
    if (campaign === null) return { ok: false, message: "Could not find the specified campaign" };

    // Has user characters in campaign
    const characters = await query<Character[]>(`
        SELECT c.*
        FROM campaign_characters cc
                 JOIN \`character\` c ON cc.character_id = c.id
        WHERE cc.campaign_id = ?
          AND c.owner_id = ?
    `, campaignId, user.id);

    if (characters.length < 1) return { ok: false, message: "You don't have any characters in this campaign" };

    const characterIds = characters.map(character => character.id);
    const args: string[] = [];
    characterIds.forEach(() => args.push("?"));

    await query(`
        UPDATE campaign_characters
        SET status = 'abandoned'
        WHERE character_id IN (${ args.join(",") })
    `, ...characterIds);

    return { ok: true, message: `You have left ${ campaign.name }` };
}