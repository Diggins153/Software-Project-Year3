import { hasDigits, hasLowercase, hasSpecialCharacter, hasUppercase } from "@/lib/formValidation";
import { isValidRace, userExists } from "@/lib/formValidationServer";
import { z } from "zod";

export const LoginFormSchema = z.object({
    email: z
        .string()
        .email("Please enter an email address."),
    password: z.string(),
});

export const RegisterFormSchema = z.object({
    displayName: z
        .string()
        .min(0, "Please enter a display name.")
        .max(40, "Your display name cannot be longer than 40 character."),
    email: z
        .string()
        .email("Please enter an email address.")
        .max(64, "The email address cannot be longer than 64 characters. Please choose a different one.")
        .refine(async (value) => !await userExists(value), "This email address is already in use. Please choose a different one"),
    password: z
        .string()
        .min(10, "Password must be at least 10 characters long.")
        .superRefine((value, ctx) => {
            if (!hasSpecialCharacter(value)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password must have a special character." });
            }

            if (!hasDigits(value)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password must have a digit." });
            }

            if (!hasUppercase(value)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password must have an uppercase letter." });
            }

            if (!hasLowercase(value)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password must have a lowercase letter." });
            }
        }),
    gdpr: z
        .boolean({ required_error: "You need to accept the terms to continue." })
        .default(false)
        .refine(value => value === true, "You need to accept the terms to continue."),
});

export const EditCharacterFormSchema = z.object({
    name: z
        .string({ required_error: "Please enter a name" })
        .max(255, "Name can have maximum of 255 characters"),
    race: z
        .string()
        .refine(async race => await isValidRace(race), "The value of race is invalid."),
    // classes: z
    //     .array(),
    handle: z
        .string({ required_error: "Please specify a handle" })
        .max(255, "Handle cannot have more than 255 characters"),
    image: z.any(),
    // .refine(file => {}), // Further refinements
});

export const CampaignFormSchema = z.object({
    name: z
        .string()
        .min(1, "Please enter a campaign name")
        .max(255, "Title cannot be more than 255 characters long."),
    maxPlayers: z
        .number()
        .min(1, "Please enter a player limit."),
    signupsOpen: z
        .boolean()
        .default(true),
    outline: z
        .string({message: "HEHE"})
        .max(60, "Damn, that's long 😳 Unfortunately we cannot save such a long text. Please make it at most 65 000 characters or less.")
        .optional(),
    banner: z.any(),
});
