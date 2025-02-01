import { fetchUser } from "@/lib/actions/authentication";
import { loginFormSchema } from "@/lib/formSchemas";
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
                    let user = null;

                    const { email, password } = await loginFormSchema.parseAsync(credentials);

                    user = await fetchUser(email);

                    console.log("User:", user);

                    // if (!!user && await bcrypt.compare(password, user.password)) {
                    if (!!user && user.password === password) {
                        return user;
                    }

                    return null;
                } catch (error) {
                    if (error instanceof ZodError) {
                        console.error("ZodError", error);
                    } else {
                        console.error("UnknownError", error);
                    }

                    return null;
                }
            },
        }),
    ],
});
