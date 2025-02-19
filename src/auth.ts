import { authConfig } from "@/auth.config";
import { fetchUser, User } from "@/lib/actions/authentication";
import { LoginFormSchema } from "@/lib/formSchemas";
import bcrypt from "bcryptjs";
import NextAuth, { type User as AuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ZodError } from "zod";

declare module "next-auth" {
    interface User {
        displayName: string;
        role: "USER" | "ADMIN";
        isPaying: boolean;
        lastConsentDate: Date;
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    let user: User | null = null;

                    const { email, password } = await LoginFormSchema.parseAsync(credentials);

                    user = await fetchUser(email);

                    console.log("User:", user);

                    if (!!user && await bcrypt.compare(password, user.password)) {
                        // Note: Typing to unknown and then to AuthUser is required, else this whole function errors out
                        return user as unknown as AuthUser;
                    }
                } catch (error) {
                    if (error instanceof ZodError) {
                        console.error("ZodError", error);
                    } else {
                        console.error("UnknownError", error);
                    }
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session }) {
            const user = await fetchUser(session.user.email);
            if (!user) {
                return session;
            }

            // session.user.email = user.email;
            // session.user.displayName = user.display_name;
            // session.user.role = user.role;
            // session.user.isPaying = user.is_paying;
            // session.user.lastConsentDate = user.last_consent_date;

            return {
                ...session,
                user: {
                    ...session.user,
                    email: user.email,
                    displayName: user.display_name,
                    role: user.role,
                    isPaying: user.is_paying,
                    lastConsentDate: user.last_consent_date,
                },
            };
        },
    },
});
