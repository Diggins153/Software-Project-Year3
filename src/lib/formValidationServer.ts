"use server";

import getDB from "@/lib/getDB";

export async function userExists(email: string): Promise<boolean> {
    const db = await getDB();
    const result = await db.query("SELECT count(id) FROM `user` WHERE email = ?", email) as { count: number };

    return result.count > 0;
}

export async function isValidRace(race: string): Promise<boolean> {
    const db = await getDB();
    const result = await db.query("SELECT count(id) FROM race WHERE name = ?", race) as { count: number };
    return result.count == 1;
}
