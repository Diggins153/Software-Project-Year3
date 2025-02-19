import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth }) {
            return !!auth?.user;
        },
    },
    providers: [],
} satisfies NextAuthConfig;