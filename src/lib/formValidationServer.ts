"use server";

import query from "@/lib/database";

export async function userExists(email: string): Promise<boolean> {
    const result = await query<{ count: number }[]>("SELECT count(id) as count FROM `user` WHERE email = ?", email);
    return result[0].count > 0;
}

export async function isValidRace(raceId: number): Promise<boolean> {
    const result = await query<{ count: number }[]>("SELECT count(id) as count FROM race WHERE id = ?", raceId);
    return result[0].count == 1;
}

/**
 * Checks that a handle is unique among all the characters except the character that is being updated.
 * @param handle The handle to be checked
 * @param currentCharacterId Character ID that is being updated so it can be excluded from the unique check.
 */
export async function isHandleUnique(handle: string, currentCharacterId: number): Promise<boolean> {
    handle = handle.toLowerCase();
    const result = await query<{ count: number }[]>(
        "SELECT count(handle) AS count FROM `character` WHERE handle = ? AND NOT id = ?",
        handle, currentCharacterId);
    return result[0].count == 0;
}
