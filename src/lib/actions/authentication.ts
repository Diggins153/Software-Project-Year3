"use server";

import { User } from "@/types/User";
import { signIn } from "@/lib/auth";
import { LoginFormSchema, RegisterFormSchema } from "@/lib/formSchemas";
import getDB from "@/lib/getDB";
import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

export async function register(formValues: z.infer<typeof RegisterFormSchema>) {
    const parseResult = await RegisterFormSchema.safeParseAsync(formValues);

    if (!parseResult.success) return { success: false, errors: parseResult.error.format() };

    let { displayName, email, password } = parseResult.data;
    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(12));

    const db = await getDB();
    await db.query("INSERT INTO `user`(created_at, updated_at, display_name, email, password, last_consent_date) VALUE (now(), now(), ?, ?, ? , now())", displayName, email, passwordHash);

    await signIn("credentials", { email, password, redirectTo: "/" });

    return { success: true };
}

export async function login(formValues: z.infer<typeof LoginFormSchema>) {
    const parseResult = LoginFormSchema.safeParse(formValues);

    if (!parseResult.success) return { success: false, errors: parseResult.error.format() };

    const { email, password } = parseResult.data;

    try {
        await signIn("credentials", { email, password, redirectTo: "/" });
    } catch (e) {
        if (isRedirectError(e)) {
            throw e;
        } else {
            console.error("Sign in", e);
        }
    }

    // return { success: true };
}

export async function fetchUser(email: string): Promise<User | null> {
    const db = await getDB();
    const response = await db.query<User[]>("SELECT * FROM `user` WHERE email = ? LIMIT 1", email);

    if (response.length != 1) return null;

    return response[0];
}
