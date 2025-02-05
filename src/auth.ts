import { fetchUser, User } from "@/lib/actions/authentication";
import { LoginFormSchema } from "@/lib/formSchemas";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ZodError } from "zod";

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            displayName: string;
            email: string;
            role: "USER" | "ADMIN";
            isPaying: boolean;
            lastConsentDate: Date;
        };
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your@email.ie" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    let user: User | null = null;

                    const { email, password } = await LoginFormSchema.parseAsync(credentials);

                    user = await fetchUser(email);

                    console.log("User:", user);

                    if (!!user && await bcrypt.compare(password, user.password)) {
                        return user;
                    }

                    return null;
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

            session.user.email = user.email;
            session.user.displayName = user.display_name;
            session.user.email = user.email;
            session.user.role = user.role;
            session.user.isPaying = user.is_paying;
            session.user.lastConsentDate = user.last_consent_date;

            return session;
        },
    },
});
