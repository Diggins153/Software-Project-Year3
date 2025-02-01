"use server";

import { db } from "@/lib/db";

export async function userExists(email: string): Promise<boolean> {
    let usersCount: number = await db("users")
        .count<number>("email as count")
        .where({ email: email })
        .then((value: any) => (value[0].count as number));

    return usersCount > 0;
}
