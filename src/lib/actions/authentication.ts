"use server";

import { registerFormSchema } from "@/lib/formSchemas";
import { z } from "zod";

export async function register(values: z.infer<typeof registerFormSchema>) {
    console.log(values);
}
