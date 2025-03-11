"use server";

import query from "@/lib/database";
import { EditCharacterFormSchema } from "@/lib/formSchemas";
import { Character } from "@/types/Character";
import { CharacterClass } from "@/types/CharacterClass";
import { Class } from "@/types/Class";
import { Race } from "@/types/Race";
import { fetchUser } from "@/lib/actions/authentication";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

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

export async function updateCharacter(characterId: number, formData: z.infer<typeof EditCharacterFormSchema>): Promise<
    { ok: false, message: string } |
    { ok: true }
> {
    // Session check
    const session = await auth();
    if (!session || !session.user) return redirect("/");

    // Validate data
    const result = await EditCharacterFormSchema.safeParseAsync(formData);
    if (!result.success) return { ok: false, message: "Please check the data is correct" };
    else formData = result.data;

    // Check the character exists
    let character = (await query<Character[]>("SELECT * FROM `character` WHERE id = ?", characterId))[0] || null;
    if (!character) return { ok: false, message: "Could not find that character" };
    let characterClasses = await query<CharacterClass[]>("SELECT * FROM character_class WHERE character_id = ?", characterId);

    // Check owner
    if (character.owner_id.toString() !== session.user.id)
        return { ok: false, message: "Sorry, you are not allowed to update someone else's character." };

    if (formData.id != characterId) {
        console.error(`Cannot update character (characterId = ${ characterId }) with formData (formData.id = ${ formData.id }). ID mismatch`);
        return { ok: false, message: "Something went wrong." };
    }

    // Construct update
    const parametrizedKeys: string[] = [];
    const params = [];
    if (formData.name !== character.name) {
        parametrizedKeys.push("name = ?");
        params.push(formData.name);
    }
    if (formData.handle !== character.handle) {
        parametrizedKeys.push("handle = ?");
        params.push(formData.handle);
    }
    // TODO: Image
    if (formData.raceId !== character.race_id) {
        parametrizedKeys.push("race_id = ?");
        params.push(formData.raceId);
    }
    if (formData.classId !== characterClasses[0].class_id) {
        await query("UPDATE character_class SET class_id = ? WHERE character_id = ? AND class_id = ?", formData.classId, characterId, characterClasses[0].class_id);
        characterClasses[0].class_id = formData.classId;
    }
    if (formData.level !== characterClasses[0].level) {
        await query("UPDATE character_class SET level = ? WHERE character_id = ? AND class_id = ?", formData.level, characterId, characterClasses[0].class_id);
    }

    // Do update
    if (parametrizedKeys.length == 0) return { ok: true };
    let statement = `UPDATE \`character\` SET ${ parametrizedKeys.join(", ") } WHERE id = ?`;

    try {
        await query(statement, ...params, characterId);
    } catch (e) {
        console.error(e);
        return { ok: false, message: "Something went wrong" };
    }

    return { ok: true };
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
