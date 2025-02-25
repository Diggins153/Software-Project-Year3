"use server";

import { User } from "@/entities/User";
import getORM from "@/lib/orm";

export async function userExists(email: string): Promise<boolean> {
    const orm = await getORM();
    const userCount = await orm.count(User, { email });

    return userCount > 0;
}
