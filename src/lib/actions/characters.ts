"use server";

import { Character } from "@/entities/Character";
import { CharacterClass } from "@/entities/CharacterClass";
import { Class } from "@/entities/Class";
import { Race } from "@/entities/Race";
import { User } from "@/entities/User";
import { auth } from "@/lib/auth";
import getORM from "@/lib/orm";
import { redirect } from "next/navigation";
import {ref} from "@mikro-orm/core";

export async function createCharacter(name: string, race: string) {
    const session = await auth();
    if (!session || !session.user) return redirect("/");

    const em = await getORM();
    const user = await em.findOne(User, { email: session.user.email });
    if (!user) return { ok: false };

    // Retrieve the Race entity based on the provided race name.
    const dbRace = await em.findOne(Race, { name: race });
    if (!dbRace) return { ok: false, error: "Invalid race" };

    // Create a new character instance.
    const newChar = new Character(name, `handle:${name}`, dbRace);
    newChar.image = "https://placehold.co/75.png";

    // Set the owner so that the required owner_id field is populated.
    newChar.owner = ref(user);

    // Add the character to the user's collection.
    user.characters.add(newChar);

    // Persist and flush the new character so it gets an ID.
    em.persist(newChar);
    await em.flush();

    return redirect("/characters");
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
    newChar.classes.add(new CharacterClass(newChar, dbClass, 1));
    user.characters.add(newChar);

    await em.flush();

    return redirect("/characters");
}
