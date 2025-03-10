"use server";

import query from "@/lib/database";
import { SessionFormSchema } from "@/lib/formSchemas";
import { z } from "zod";

export async function createSession(
    data: z.infer<typeof SessionFormSchema>,
    campaignId: number
) {
    try {
        // Convert datetime-local string (e.g. "2025-03-30T18:50") to "YYYY-MM-DD HH:MM:SS" format.
        const formatDateTime = (dt: string) => {
            const [datePart, timePart] = dt.split("T");
            let formattedTime = timePart || "";
            if (formattedTime && formattedTime.split(":").length === 2) {
                formattedTime += ":00";
            }
            return `${datePart} ${formattedTime}`;
        };

        const formattedSessionDate = formatDateTime(data.sessionDate);
        const formattedSignupDeadline = formatDateTime(data.signupDeadline);

        // Ensure the SQL string is exactly defined with 6 placeholders.
        const sql =
            "INSERT INTO session (campaign_id, title, excerpt, writeup, session_date, signup_deadline) VALUES (?, ?, ?, ?, ?, ?)";
        await query(sql,
            campaignId,
            data.title,
            data.excerpt ?? "",
            data.writeup ?? "",
            formattedSessionDate,
            formattedSignupDeadline,
        );

        return {
            ok: true,
            message: "Session created successfully",
            redirect: `/campaigns/view?campaignId=${campaignId}`,
        };
    } catch (error) {
        console.error("Error creating session:", error);
        return {
            ok: false,
            message: "Failed to create session",
        };
    }
}
