"use server";

import query from "@/lib/database";
import { SendChatMessageSchema } from "@/lib/formSchemas";
import { INCOMING_MESSAGE_EVENT, pusherServer } from "@/lib/pusher";
import { ensureSession } from "@/lib/utils";
import { CampaignCharacters } from "@/types/CampaignCharacters";
import { Character } from "@/types/Character";
import { Message } from "@/types/Message";
import { ResultSetHeader } from "mysql2";

export async function sendMessage(formData: FormData): Promise<
    { ok: true } |
    { ok: false, message?: string, errors?: object }
> {
    const { user } = await ensureSession();
    const result = await SendChatMessageSchema.safeParseAsync({
        message: formData.get("message"),
        characterId: formData.get("characterId"),
        campaignId: formData.get("campaignId"),
    });

    if (!result.success) {
        return { ok: false, errors: result.error.flatten().fieldErrors };
    }
    const { campaignId, characterId, message } = result.data;

    // Check user can send message to that campaign
    const userCharacters = await query<Character[]>(`
        SELECT *
        FROM \`character\`
        WHERE owner_id = ?
          AND id = ?
    `, user.id, characterId);
    if (userCharacters.length != 1) {
        return { ok: false, message: "You can only send messages as one of your characters." };
    }

    const campaignCharacters = await query<CampaignCharacters[]>(`
        SELECT *
        FROM campaign_characters
        WHERE campaign_id = ?
          AND character_id = ?
    `, campaignId, characterId);
    if (campaignCharacters.length != 1) {
        return { ok: false, message: "You can only send messages to campaigns you're part of." };
    }

    const insertResult: ResultSetHeader = await query(`
        INSERT INTO messages(message, campaign_id, author_id)
            VALUE (?, ?, ?)
    `, message.trim(), campaignId, characterId);

    const newMessage = await query<Message[]>(`
        SELECT m.*,
               c.name   AS author_name,
               c.handle AS author_handle
        FROM messages m
                 JOIN \`character\` c ON c.id = m.author_id
        WHERE m.id = ?
    `, insertResult.insertId);

    await pusherServer.trigger(`campaign-${ campaignId }`, INCOMING_MESSAGE_EVENT, newMessage[0]);

    return { ok: true };
}