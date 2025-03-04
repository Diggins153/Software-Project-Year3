"use server";

import { User as OrmUser } from "@/entities/User";
import { signIn } from "@/lib/auth";
import { LoginFormSchema, RegisterFormSchema } from "@/lib/formSchemas";
import getDB from "@/lib/getDB";
import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

export type User = {
    id: number;
    display_name: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
    is_paying: boolean;
    last_consent_date: Date;
}

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

export async function fetchUser(email: string): Promise<OrmUser | null> {
    const db = await getDB();
    return await db.query("SELECT count(id) AS count FROM `user` WHERE email = ?", email) as OrmUser;
}
