"use server";

import { signIn } from "@/auth";
import { LoginFormSchema, RegisterFormSchema } from "@/lib/formSchemas";
import getORM from "@/lib/orm";
import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";
import { User as OrmUser } from "@/entities/User";

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

    const orm = await getORM();
    const newUser = new OrmUser(displayName, email, passwordHash, new Date(Date.now()));

    orm.persist(newUser);
    await orm.flush();

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
    const orm = await getORM();

    return await orm.findOne(OrmUser, { email });
}
