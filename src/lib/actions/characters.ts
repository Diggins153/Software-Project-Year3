"use server";

import { Character } from "@/entities/Character";
import { CharacterClasses } from "@/entities/CharacterClasses";
import { Class } from "@/entities/Class";
import { Race } from "@/entities/Race";
import { User } from "@/entities/User";
import { auth } from "@/lib/auth";
import getORM from "@/lib/orm";
import { redirect } from "next/navigation";

export async function createCharacter(/* Put character deatails as arguments here */) {

}

export async function createPremadeCharacter(name: string, race: string, charClass: string) {
    const session = await auth();

    if (!session || !session.user) {
        return redirect("/");
    }

    const em = await getORM();
    const user = await em.findOne(User, { email: session.user.email });

    if (user == null) {
        return { ok: false };
    }

    const dbRace = await em.findOne(Race, { name: race });
    if (dbRace == null) {
        return { ok: false, message: "Invalid race" };
    }
    const dbClass = await em.findOne(Class, { name: charClass });
    if (dbClass == null) {
        return { ok: false, message: "Invalid class" };
    }
    const newChar = new Character(name, `@${ name }`, dbRace);

    newChar.image = "https://placehold.co/75.png";
    newChar.classes.add(new CharacterClasses(newChar, dbClass, 1));
    user.characters.add(newChar);

    await em.flush();

    return redirect("/characters");
}
