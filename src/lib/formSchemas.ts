import { hasDigits, hasLowercase, hasSpecialCharacter, hasUppercase } from "@/lib/formValidation";
import { isHandleUnique, isValidClass, isValidRace, userExists } from "@/lib/formValidationServer";
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
    passwordCheck: z
        .string(),
    gdpr: z
        .boolean({ required_error: "You need to accept the terms to continue." })
        .default(false)
        .refine(value => value === true, "You need to accept the terms to continue."),
})
    .superRefine((arg, ctx) => {
        if (arg.password !== arg.passwordCheck) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Passwords need to match",
                path: [ "passwordCheck" ],
            });
        }
    });

export const EditCharacterFormSchema = z.object({
    id: z
        .coerce
        .number(),
    name: z
        .string()
        .min(1, "Please enter a name")
        .max(40, "Name can have maximum of 40 characters"),
    raceId: z
        .coerce
        .number()
        .refine(async raceId => await isValidRace(raceId), "The selected race is invalid."),
    classId: z
        .coerce
        .number()
        .refine(async classId => await isValidClass(classId), "The selected class is invalid"),
    level: z
        .coerce
        .number()
        .gte(1, "Levels can't go below 1")
        .lte(20, "Levels can't go above 20"),
    handle: z
        .string()
        .toLowerCase()
        .min(1, "Please specify a handle")
        .max(50, "Handle cannot have more than 50 characters")
        .regex(/[a-z0-9-]+/, "Handle can only contain lowercase letters and - (dashes)")
        .transform(value => value.replaceAll(/(?![a-z0-9-]+)./g, "")),
    image: z.any(),
})
    .superRefine(async (arg, ctx) => {
        const isUnique = await isHandleUnique(arg.handle, arg.id);
        if (!isUnique) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "This handle is already used by different character. Please choose a different one.",
                path: [ "handle" ],
            });
        }
    });

export const CampaignFormSchema = z.object({
    name: z
        .string()
        .min(1, "Please enter a campaign name")
        .max(255, "Title cannot be more than 255 characters long."),
    maxPlayers: z
        .coerce
        .number()
        .min(1, "Please enter a player limit."),
    signupsOpen: z
        .boolean()
        .default(true),
    outline: z
        .string()
        .max(60_000, "Damn, that's long 😳 Unfortunately we cannot save such a long text. Please make it at most 65 000 characters or less.")
        .optional(),
    banner: z.any(),
});

export const SessionFormSchema = z.object({
    title: z.string().min(1, "Session title is required"),
    excerpt: z.string().optional(),
    writeup: z.string().optional(),
    sessionDate: z.string().min(1, "Session date is required"),
    signupDeadline: z.string().min(1, "Signup deadline is required"),
});

export const TransferOwnershipFormSchema = z.object({
    campaignId: z
        .coerce
        .number(),
    newOwnerEmail: z
        .string()
        .email("Please enter an email address")
        .refine(async email => userExists(email), "You can transfer campaigns to registered users only."),
    confirmation: z
        .string()
        .refine(value => value === "confirm transfer", "Enter the required phrase."),
});