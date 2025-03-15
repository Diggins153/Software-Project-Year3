"use server";

import { signOut } from "@/lib/auth";
import query from "@/lib/database";
import { UpdateUserFormSchema } from "@/lib/formSchemas";
import { ensureSession } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function updateUser(data: z.infer<typeof UpdateUserFormSchema>): Promise<
    { ok: true } |
    { ok: false, message: string }
> {
    const { user } = await ensureSession();
    const result = await UpdateUserFormSchema.safeParseAsync(data);
    if (!result.success) return { ok: false, message: "Please check form" };
    const { id, displayName, email, password, passwordCheck } = result.data;
    if (id.toString() !== user.id) return { ok: false, message: "You can only update your own details" };

    const parametrizedKeys: string[] = [];
    const params = [];
    if (!!displayName && user.display_name !== displayName) {
        parametrizedKeys.push("display_name = ?");
        params.push(displayName);
    }
    if (!!email && user.email !== email) {
        parametrizedKeys.push("email = ?");
        params.push(email);
    }
    if (password && passwordCheck && password === passwordCheck && await bcrypt.compare(password, user.password)) {
        parametrizedKeys.push("password = ?");
        params.push(await bcrypt.hash(password, await bcrypt.genSalt(12)));
    }
    if (parametrizedKeys.length == 0) return { ok: true };
    let statement = `UPDATE user
                     SET ${ parametrizedKeys.join(", ") }
                     WHERE id = ?`;

    try {
        await query(statement, ...params, user.id);
    } catch (e) {
        console.error("Error when updating character", e);
        return { ok: false, message: "Something went wrong" };
    }

    return { ok: true };
}

export async function deleteAccount(): Promise<{ ok: boolean, message: string }> {
    const { user } = await ensureSession();

    try {
        await query(`
            DELETE
            FROM session
            WHERE campaign_id IN (SELECT id FROM campaign WHERE dungeon_master_id = ?)
        `, user.id);
        await query(`
            DELETE
            FROM campaign_characters
            WHERE campaign_id IN (SELECT id FROM campaign WHERE dungeon_master_id = ?)
        `, user.id);
        await query(`
            DELETE
            FROM campaign
            WHERE dungeon_master_id = ?
        `, user.id);
        await query(`
            DELETE
            FROM \`character\`
            WHERE owner_id = ?
        `, user.id);
        await query(`
            DELETE
            FROM user
            WHERE id = ?
        `, user.id);
    } catch (e) {
        console.error("Error while deleting user");
        return { ok: false, message: "Error in deleting data" };
    }
    return { ok: true, message: "Account deleted" };
}

export async function logOut() {
    await ensureSession();
    await signOut({ redirectTo: "/" });
}