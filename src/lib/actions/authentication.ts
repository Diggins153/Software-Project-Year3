"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { loginFormSchema, registerFormSchema } from "@/lib/formSchemas";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function register(values: z.infer<typeof registerFormSchema>) {
    console.log(values);
}

export async function login(formValues: z.infer<typeof loginFormSchema>) {
    const parseResult = loginFormSchema.safeParse(formValues);

    if (!parseResult.success) return { success: false, errors: parseResult.error.format() };

    const { email, password } = parseResult.data;

    await signIn("credentials", { email, password, redirectTo: "/" });

    return { success: true };
}

type User = {
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
