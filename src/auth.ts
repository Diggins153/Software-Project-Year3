import { authConfig } from "@/auth.config";
import { fetchUser } from "@/lib/actions/authentication";
import { LoginFormSchema } from "@/lib/formSchemas";
import bcrypt from "bcryptjs";
import NextAuth, { type NextAuthResult, type User as AuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { User as OrmUser } from "@/entities/User";

declare module "next-auth" {
    interface User {
        displayName: string;
        role: "USER" | "ADMIN";
        isPaying: boolean;
        lastConsentDate: Date;
    }
}

// Note: Doing weird typing as TS has an issue with the option "declaration: true" and a dependency in next-auth
export const { handlers, auth, signIn, signOut }: NextAuthResult & { signIn: any } = NextAuth({
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
                    const { email, password } = await LoginFormSchema.parseAsync(credentials);

                    let user: OrmUser | null = await fetchUser(email);

                    if (process.env.DEBUG) console.log("User:", user);

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

            return {
                ...session,
                user: {
                    ...session.user,
                    email: user.email,
                    displayName: user.displayName,
                    role: user.role,
                    isPaying: user.isPaying,
                    lastConsentDate: user.lastConsentDate,
                },
            };
        },
    },
});
