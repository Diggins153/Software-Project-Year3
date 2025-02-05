"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { LoginFormSchema, RegisterFormSchema } from "@/lib/formSchemas";
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

    await db("users").insert({
        display_name: displayName,
        email: email,
        password: passwordHash,
        role: "USER",
        is_paying: false,
        last_consent_date: new Date(),
    });

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
    return (await db("users").select("*").where({ email: email }).first()) ?? null;
}
