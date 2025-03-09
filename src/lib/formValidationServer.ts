"use server";

import query from "@/lib/database";

export async function userExists(email: string): Promise<boolean> {
    const result = await query<{ count: number }>("SELECT count(id) FROM `user` WHERE email = ?", email);

    return result.count > 0;
}

export async function isValidRace(raceId: number): Promise<boolean> {
    const result = await query<{ count: number }>("SELECT count(id) FROM race WHERE id = ?", raceId);
    return result.count == 1;
}
