"use server";

import { signIn } from "@/auth";
import { loginFormSchema, registerFormSchema } from "@/lib/formSchemas";
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
