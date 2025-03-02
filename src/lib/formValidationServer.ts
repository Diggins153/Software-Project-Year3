"use server";

import { Race } from "@/entities/Race";
import { User } from "@/entities/User";
import getORM from "@/lib/orm";

export async function userExists(email: string): Promise<boolean> {
    const orm = await getORM();
    const userCount = await orm.count(User, { email });

    return userCount > 0;
}

export async function isValidRace(race: string):Promise<boolean> {
    const em = (await getORM()).getRepository(Race);
    return await em.count({ name: race }) == 1;
}
