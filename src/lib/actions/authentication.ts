"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { loginFormSchema, registerFormSchema } from "@/lib/formSchemas";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function register(formValues: z.infer<typeof registerFormSchema>) {
    const parseResult = await registerFormSchema.safeParseAsync(formValues);

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

export async function login(formValues: z.infer<typeof loginFormSchema>) {
    const parseResult = loginFormSchema.safeParse(formValues);

    if (!parseResult.success) return { success: false, errors: parseResult.error.format() };

    const { email, password } = parseResult.data;

    await signIn("credentials", { email, password, redirectTo: "/" });

    return { success: true };
}

export type User = {
    id: number;
    display_name: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
    is_paying: boolean;
    last_consent_date: Date;
}

export async function fetchUser(email: string): Promise<User | null> {
    return (await db("users").select("*").where({ email: email }).first()) ?? null;
}
