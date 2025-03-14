"use server";

import query from "@/lib/database";
import { ensureSession } from "@/lib/utils";
import { Campaign } from "@/types/Campaign";
import { Character } from "@/types/Character";

export type CampaignPlayerResponse = {
    ok: boolean,
    message: string
};

async function ensureCharacter(characterId: number): Promise<Character | null> {
    const characterResult = await query<Character[]>("SELECT * FROM `character` WHERE id = ?", characterId);
    if (characterResult.length != 1) return null;
    return characterResult[0];
}

async function ensureCharacterInCampaign(characterId: number, campaignId: number): Promise<boolean> {
    const result = await query<{ is_present: boolean }[]>(
        "SELECT TRUE AS is_present FROM campaign_characters WHERE campaign_id = ? AND character_id = ?",
        campaignId, characterId,
    );
    if (result.length != 1) return false;
    return result[0].is_present;
}

async function ensureUserIsDungeonMaster(campaignId: number) {
    const session = await ensureSession();
    const campaigns = await query<Campaign[]>("SELECT dungeon_master_id FROM campaign WHERE id = ?", campaignId);

    if (campaigns.length != 1) return false;
    return campaigns[0].dungeon_master_id.toString() === session.user.id;
}

async function doChecks(campaignId: number, characterId: number): Promise<
    { ok: false, message: string } |
    { ok: true, character: Character }
> {
    const isDM = await ensureUserIsDungeonMaster(campaignId);
    if (!isDM) return { ok: false, message: "You can only manage your own campaigns" };
    const character = await ensureCharacter(characterId);
    if (character === null) return { ok: false, message: "Could not find the specified character." };
    if (!await ensureCharacterInCampaign(characterId, campaignId))
        return { ok: false, message: "The specified character is not in this campaign" };

    return { ok: true, character: character };
}

export async function kickPlayer(campaignId: number, characterId: number): Promise<CampaignPlayerResponse> {
    const result = await doChecks(campaignId, characterId);
    let character = null;
    if (!result.ok) return result;
    else character = result.character;

    await query("UPDATE campaign_characters SET status = 'kicked' WHERE character_id = ?", characterId);
    return { ok: true, message: `${ character.name } has been kicked` };
}

export async function banPlayer(campaignId: number, characterId: number): Promise<CampaignPlayerResponse> {
    const result = await doChecks(campaignId, characterId);
    let character = null;
    if (!result.ok) return result;
    else character = result.character;

    await query("UPDATE campaign_characters SET status = 'banned' WHERE character_id = ?", characterId);
    return { ok: true, message: `${ character.name } has been banned.` };
}

export async function removeBan(campaignId: number, characterId: number): Promise<CampaignPlayerResponse> {
    const result = await doChecks(campaignId, characterId);
    let character = null;
    if (!result.ok) return result;
    else character = result.character;

    await query("DELETE FROM campaign_characters WHERE campaign_id = ? AND character_id = ?", campaignId, character);
    return { ok: true, message: `${ character.name } has been unbanned.` };
}

export async function cancelInvitation(campaignId: number, characterId: number): Promise<CampaignPlayerResponse> {
    const result = await doChecks(campaignId, characterId);
    let character = null;
    if (!result.ok) return result;
    else character = result.character;

    await query("DELETE FROM campaign_characters WHERE campaign_id = ? AND character_id = ?", campaignId, character);
    return { ok: true, message: `Invitation to ${ character.name } has been cancelled.` };
}
