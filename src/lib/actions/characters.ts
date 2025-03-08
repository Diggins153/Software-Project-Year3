"use server";

import query from "@/lib/database";
import { Character } from "@/types/Character";
import { Class } from "@/types/Class";
import { Race } from "@/types/Race";
import { fetchUser } from "@/lib/actions/authentication";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createCharacter(name: string, race: string) {
    const session = await auth();
    if (!session || !session.user) return redirect("/");

    const user = await fetchUser(session.user.email!);
    if (!user) return { ok: false };

    // Retrieve the Race entity based on the provided race name.
    const dbRace = (await query<Race[]>("SELECT name FROM race WHERE name = ?", race))[0] || null;
    if (!dbRace) return { ok: false, error: "Invalid race" };

    // Add the character to the user's collection.
    await query("INSERT INTO `character` (created_at, updated_at, name, handle, race_id, image, owner_id) VALUE (now(), now(), ?, ?, ?, '', ?)", name, `@${ name }`, dbRace.id, session.user.id);

    // Persist and flush the new character so it gets an ID.
    return redirect("/characters");
}

export async function createPremadeCharacter(name: string, race: string, charClass: string) {
    const session = await auth();

    if (!session || !session.user) {
        return redirect("/");
    }

    const dbRace = (await query<Race[]>("SELECT * FROM race WHERE name = ?", race))[0] || null;
    if (dbRace == null) {
        return { ok: false, message: "Invalid race" };
    }
    const dbClass = (await query<Class[]>("SELECT * FROM class WHERE name = ?", charClass))[0] || null;
    if (dbClass == null) {
        return { ok: false, message: "Invalid class" };
    }

    await query("INSERT INTO `character` (created_at, updated_at, name, handle, race_id, image, owner_id) VALUE (now(), now(), ?, ?, ?, '', ?)", name, `@${ name }`, dbRace.id, session.user.id);

    return redirect("/characters");
}

export async function deleteCharacter(characterId: number): Promise<
    { ok: false, message: string } |
    { ok: true, message: string, redirect: string }
> {
    const session = await auth();
    // Session check
    if (!session || !session.user) return redirect("/characters");

    const character = (await query<Character[]>("SELECT name, owner_id FROM `character` WHERE id = ?", characterId))[0] || null;

    // Check the character exists
    if (!character) return { ok: false, message: "Could not find that character." };

    // Check the current user owns that character
    if (character.owner_id.toString() != session.user.id)
        return { ok: false, message: "Sorry, you are not allowed to delete someone else's character." };

    // Delete character
    await query("DELETE FROM character_class WHERE character_id = ?", characterId);
    await query("DELETE FROM `character` WHERE id = ?", characterId);

    return { ok: true, message: `${ character.name } deleted.`, redirect: "/characters" };
}
