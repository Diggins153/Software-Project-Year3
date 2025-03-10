// lib/actions/sessions.ts
"use server";

import query from "@/lib/database";
import { SessionFormSchema } from "@/lib/formSchemas";
import {z} from "zod";

export async function createSession(data: z.infer<typeof SessionFormSchema>, campaignId: number) {
    // Validate data with SessionFormSchema if needed, or rely on the client form validation.
    // Insert into the session table. Example columns: title, excerpt, writeup, session_date, signup_deadline, campaign_id

    try {
        // For MySQL insertion, adapt to your schema:
        await query(`
      INSERT INTO session (campaign_id, title, excerpt, writeup, session_date, signup_deadline)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
            campaignId,
            data.title,
            data.excerpt ?? "",
            data.writeup ?? "",
            data.sessionDate,
            data.signupDeadline
        ]);

        return {
            ok: true,
            message: "Session created successfully",
            redirect: `/campaigns/view?campaignId=${campaignId}`
        };
    } catch (error) {
        console.error("Error creating session:", error);
        return {
            ok: false,
            message: "Failed to create session",
        };
    }
}
