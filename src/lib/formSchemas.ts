import { z } from "zod";

export const loginFormSchema = z.object({
    email: z
        .string()
        .email("Please enter an email address."),
    password: z.string(),
});

export const registerFormSchema = z.object({
    displayName: z
        .string()
        .min(0, "Please enter a display name.")
        .max(40, "Your display name cannot be longer than 40 character."),
    email: z
        .string()
        .email("Please enter an email address.")
        .max(64, "The email address cannot be longer than 64 characters. Please choose a different one."),
    password: z
        .string()
        .min(10, "Password must be at least 10 characters long."),
});
