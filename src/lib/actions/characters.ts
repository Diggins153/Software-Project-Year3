"use server";

import { Class } from "@/types/Class";
import { Race } from "@/types/Race";
import { fetchUser } from "@/lib/actions/authentication";
import { auth } from "@/lib/auth";
import getDB from "@/lib/getDB";
import { redirect } from "next/navigation";

export async function createCharacter(name: string, race: string) {
    const db = await getDB();
    const session = await auth();
    if (!session || !session.user) return redirect("/");

    const user = await fetchUser(session.user.email!);
    if (!user) return { ok: false };

    // Retrieve the Race entity based on the provided race name.
    const dbRace = await db.query("SELECT name FROM race WHERE name = ?", race) as Race;
    if (!dbRace) return { ok: false, error: "Invalid race" };

    // Add the character to the user's collection.
    await db.query("INSERT INTO `character` (created_at, updated_at, name, handle, race_id, image, owner_id) VALUE (now(), now(), ?, ?, ?, '', ?)", name, `@${ name }`, dbRace.id, session.user.id);

    // Persist and flush the new character so it gets an ID.
    return redirect("/characters");
}

export async function createPremadeCharacter(name: string, race: string, charClass: string) {
    const db = await getDB();
    const session = await auth();

    if (!session || !session.user) {
        return redirect("/");
    }

    const dbRace = await db.query("SELECT * FROM race WHERE name = ?", race) as Race;
    if (dbRace == null) {
        return { ok: false, message: "Invalid race" };
    }
    const dbClass = await db.query("SELECT * FROM class WHERE name = ?", charClass) as Class;
    if (dbClass == null) {
        return { ok: false, message: "Invalid class" };
    }

    await db.query("INSERT INTO `character` (created_at, updated_at, name, handle, race_id, image, owner_id) VALUE (now(), now(), ?, ?, ?, '', ?)", name, `@${ name }`, dbRace.id, session.user.id);

    return redirect("/characters");
}
