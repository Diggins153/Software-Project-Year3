"use server";

import query from "@/lib/database";
import { ReportContentFormSchema } from "@/lib/formSchemas";
import { ensureSession } from "@/lib/utils";
import { z } from "zod";

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