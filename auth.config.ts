import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: "/login",
    },
    providers: [],
} satisfies NextAuthConfig;