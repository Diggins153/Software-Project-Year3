"use server";

import { deleteCharacter } from "@/lib/actions/characters";
import { deleteSession } from "@/lib/actions/sessions";
import query from "@/lib/database";
import { ReportContentFormSchema } from "@/lib/formSchemas";
import { ensureSession } from "@/lib/utils";
import { ContentType, Report } from "@/types/Report";
import { Session } from "@/types/Session";
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
        // case ContentType.USER:
        //     await deleteUser(report.content_id);
        //     break;
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
