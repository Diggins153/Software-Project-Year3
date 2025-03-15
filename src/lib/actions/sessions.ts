"use server";

import query from "@/lib/database";
import { SessionFormSchema } from "@/lib/formSchemas";
import { z } from "zod";

// Function to create a session
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

        // Define SQL string with exactly 6 placeholders.
        const sql =
            "INSERT INTO session (campaign_id, title, excerpt, writeup, session_date, signup_deadline) VALUES (?, ?, ?, ?, ?, ?)";
        await query(
            sql,
            campaignId,
            data.title,
            data.excerpt ?? "",
            data.writeup ?? "",
            formattedSessionDate,
            formattedSignupDeadline
        );

        return {
            ok: true,
            message: "Session created successfully",
            redirect: `/campaigns/${ campaignId }`,
        };
    } catch (error) {
        console.error("Error creating session:", error);
        return {
            ok: false,
            message: "Failed to create session",
        };
    }
}

// Function to delete a session
export async function deleteSession(sessionId: number, campaignId: number) {
    try {
        // Define SQL string with exactly 2 placeholders.
        const sql = "DELETE FROM session WHERE id = ? AND campaign_id = ?";
        await query(sql, sessionId, campaignId);

        return {
            ok: true,
            message: "Session deleted successfully",
            redirect: `/campaigns/${ campaignId }`,
        };
    } catch (error) {
        console.error("Error deleting session:", error);
        return {
            ok: false,
            message: "Failed to delete session",
        };
    }
}
