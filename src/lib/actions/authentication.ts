"use server";

import { loginFormSchema, registerFormSchema } from "@/lib/formSchemas";
import { z } from "zod";

export async function register(values: z.infer<typeof registerFormSchema>) {
    console.log(values);
}

export async function login(values: z.infer<typeof loginFormSchema>) {
    console.log(values);
}
