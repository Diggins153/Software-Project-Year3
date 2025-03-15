"use server";

import { deleteCharacter } from "@/lib/actions/characters";
import { deleteSession } from "@/lib/actions/sessions";
import query from "@/lib/database";
import { ReportContentFormSchema } from "@/lib/formSchemas";
import { ensureSession } from "@/lib/utils";
import { Campaign } from "@/types/Campaign";
import { Character } from "@/types/Character";
import { ContentType, Report } from "@/types/Report";
import { Session } from "@/types/Session";
import { User } from "@/types/User";
import { z } from "zod";

async function ensureReport(reportId: number) {
    const reports = await query<Report[]>(`
        SELECT *
        FROM reports
        WHERE id = ?
    `, reportId);
    if (reports.length !== 1) return null;

    return reports[0];
}

export async function sendReport(data: z.infer<typeof ReportContentFormSchema>): Promise<
    { ok: boolean, message: string }
> {
    const { user } = await ensureSession();
    const result = await ReportContentFormSchema.safeParseAsync(data);
    if (!result.success) return { ok: false, message: "Please check form values." };
    const { contentType, contentId, reason, userDescription } = result.data;

    await query(
        "INSERT INTO reports (content_type, content_id, reason, user_description, author_id) VALUE (?, ?, ?, ?, ?)",
        contentType, contentId, reason, userDescription || null, user.id,
    );

    return { ok: true, message: "Report sent" };
}

export async function removeContent(reportId: number): Promise<
    { ok: boolean, message: string }
> {
    const { user } = await ensureSession();
    if (user.role != "admin") return { ok: false, message: "You need to be an admin" };
    const report = await ensureReport(reportId);
    if (report === null) return { ok: false, message: "Could not find the specified report" };

    switch (report.content_type) {
        case ContentType.USER:
            await banUser(reportId);
            break;
        // case ContentType.CAMPAIGN:
        //     await deleteCampaign(report.content_id);
        //     break;
        case ContentType.SESSION:
            const session = (await query<Session[]>("SELECT campaign_id FROM session WHERE id = ?"))[0] || null;
            if (session === null) return { ok: false, message: "Could not find session campaign" };
            await deleteSession(report.content_id, session.id);
            break;
        // case ContentType.MESSAGE:
        //     await deleteMessage(report.content_id);
        //     break;
        case ContentType.CHARACTER:
            await deleteCharacter(report.content_id);
            break;
    }

    return { ok: true, message: "Content removed" };
}

export async function banUser(reportId: number): Promise<
    { ok: true } |
    { ok: false, message: string }
> {
    await ensureSession();
    const report = await ensureReport(reportId);
    if (report === null) return { ok: false, message: "Could not find the specified report" };

    let userId: number | null = null;

    switch (report.content_type) {
        case ContentType.USER:
            userId = report.content_id;
            break;
        case ContentType.CHARACTER:
            const character = (await query<Character[]>(`
                SELECT owner_id
                FROM \`character\`
                WHERE id = ?
            `, report.content_id))[0] || null;
            if (character === null) return { ok: false, message: "Could not find owner of character" };
            userId = character.owner_id;
            break;
        case ContentType.CAMPAIGN:
            const campaign = (await query<Campaign[]>(`
                SELECT dungeon_master_id
                FROM campaign
                WHERE id = ?
            `, report.content_id))[0] || null;
            if (campaign === null) return { ok: false, message: "Could not find DM of campaign" };
            userId = campaign.dungeon_master_id;
            break;
        case ContentType.SESSION:
            const user = (await query<User[]>(`
                SELECT u.id
                FROM session s
                         JOIN campaign c ON s.campaign_id = c.id
                         JOIN user u ON c.dungeon_master_id = u.id
                WHERE s.id = ?
            `, report.content_id))[0] || null;
            if (user === null) {
                return { ok: false, message: "Could not find author of session" };
            }
            userId = user.id;
            break;
        case ContentType.MESSAGE:
            userId = null;
            break;
    }

    if (userId == null) return { ok: false, message: "Unexpected error" };

    await query(`
        UPDATE user
        SET banned = TRUE
        WHERE id = ?
    `, userId);

    return { ok: true };
}
