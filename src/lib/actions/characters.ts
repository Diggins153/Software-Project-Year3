"use server";

import { auth } from "@/lib/auth";
import query from "@/lib/database";
import { EditCharacterFormSchema, ZImage } from "@/lib/formSchemas";
import { ensureSession } from "@/lib/utils";
import { Character } from "@/types/Character";
import { Class } from "@/types/Class";
import { Race } from "@/types/Race";
import { del, put } from "@vercel/blob";
import { redirect } from "next/navigation";
import { z } from "zod";

async function setCharacterImage(characterId: number, banner: File | File[]): Promise<boolean> {
    // If file array is provided, get only the first element
    if (Array.isArray(banner)) {
        banner = banner[0];
    }
    const bannerParse = await ZImage.safeParseAsync(banner);
    if (!bannerParse.success || typeof bannerParse.data === "undefined") return false;

    // Get image file extension
    const fileExt = (() => {
        const fragments = banner.name.split(".");
        if (fragments.length < 2) return "";
        else return fragments[1];
    })();
    // Get file contents
    const bannerBody = await banner.bytes();

    // Naming convention: /characters/$characterId.$fileExtension
    try {
        const uploadResult = await put(`/characters/${ characterId }.${ fileExt }`, Buffer.from(bannerBody), { access: "public" });
        await query(`
            UPDATE \`character\`
            SET image = ?
            WHERE id = ?
        `, uploadResult.url, characterId);
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
}

export async function createCharacter(
    name: string,
    race: string,
    charClass: string,
    level: number,
) {
    const { user } = await ensureSession();

    // Retrieve the Race entity with id and name.
    const dbRace = (await query<Race[]>("SELECT id, name FROM race WHERE name = ?", race))[0] || null;
    if (!dbRace) return { ok: false, error: "Invalid race" };

    // Retrieve the Class entity with id and name.
    const dbClass = (await query<Class[]>("SELECT id, name FROM `class` WHERE name = ?", charClass))[0] || null;
    if (!dbClass) return { ok: false, error: "Invalid class" };

    // Insert the new character with race_id, class_id, and level.
    await query(
        "INSERT INTO `character` (name, handle, race_id, class_id, level, image, owner_id) VALUE (?, ?, ?, ?, ?, NULL, ?)",
        name,
        `@${ name }`,
        dbRace.id,
        dbClass.id,
        level,
        user.id,
    );

    return redirect("/characters");
}

export async function createPremadeCharacter(name: string, raceId: number, classId: number, level: number) {
    const session = await auth();
    if (!session || !session.user) return redirect("/");

    const dbRace = (await query<Race[]>("SELECT id FROM race WHERE id = ?", raceId))[0] || null;
    if (dbRace == null) {
        return { ok: false, message: "Invalid race" };
    }
    const dbClass = (await query<Class[]>("SELECT id FROM `class` WHERE id = ?", classId))[0] || null;
    if (dbClass == null) {
        return { ok: false, message: "Invalid class" };
    }

    await query(
        "INSERT INTO `character` (name, handle, race_id, class_id, level, image, owner_id) VALUE (?, ?, ?, ?, ?, NULL, ?)",
        name,
        `@${ name }`,
        dbRace.id,
        dbClass.id,
        level,
        session.user.id,
    );

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

    // Check owner
    if (character.owner_id.toString() !== session.user.id)
        return { ok: false, message: "Sorry, you are not allowed to update someone else's character." };

    const { image, name, id, classId, raceId, level, handle } = formData;
    if (id != characterId) {
        console.error(`Cannot update character (characterId = ${ characterId }) with formData (formData.id = ${ id }). ID mismatch`);
        return { ok: false, message: "Something went wrong." };
    }

    // Construct update
    const parametrizedKeys: string[] = [];
    const params = [];
    if (name !== character.name) {
        parametrizedKeys.push("name = ?");
        params.push(name);
    }
    if (handle !== character.handle) {
        parametrizedKeys.push("handle = ?");
        params.push(handle);
    }
    if (!!image && (Array.isArray(image) && image.length > 0)) {
        if (character.image)
            await del(character.image);
        await setCharacterImage(characterId, image[0]);
    }
    if (raceId !== character.race_id) {
        parametrizedKeys.push("race_id = ?");
        params.push(raceId);
    }
    if (classId !== character.class_id) {
        parametrizedKeys.push("class_id = ?");
        params.push(classId);
    }
    if (level !== character.level) {
        parametrizedKeys.push("level = ?");
        params.push(level);
    }

    // Do update
    if (parametrizedKeys.length == 0) return { ok: true };
    let statement = `UPDATE \`character\`
                     SET ${ parametrizedKeys.join(", ") }
                     WHERE id = ?`;

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

    const character = (await query<Character[]>("SELECT name, owner_id, image FROM `character` WHERE id = ?", characterId))[0] || null;

    // Check the character exists
    if (!character) return { ok: false, message: "Could not find that character." };

    // Check the current user owns that character
    if (character.owner_id.toString() != session.user.id)
        return { ok: false, message: "Sorry, you are not allowed to delete someone else's character." };

    // Delete character image
    if (character.image)
        await del(character.image);

    // Delete character
    await query("DELETE FROM campaign_characters WHERE character_id = ?", characterId);
    await query("DELETE FROM character_class WHERE character_id = ?", characterId);
    await query("DELETE FROM `character` WHERE id = ?", characterId);

    return { ok: true, message: `${ character.name } deleted.`, redirect: "/characters" };
}
