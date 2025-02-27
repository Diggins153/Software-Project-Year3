import { auth } from "@/lib/auth";
import { alikeAngular, artifika } from "@/lib/fonts";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Session } from "next-auth";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export const viewport: Viewport = {
    colorScheme: "dark",
};

export default async function RootLayout({ appRoutes, publicRoutes }: Readonly<{
    children: ReactNode,
    appRoutes: ReactNode,
    publicRoutes: ReactNode
}>) {
    let session: Session | null;
    try {
        session = await auth();
    } catch (e) {
        session = null;
    }

    return (
        <html lang="en">
        <body
            className={ `${ alikeAngular.variable } ${ artifika.variable } antialiased` }
        >
        {
            !!session?.user
                ? appRoutes
                : publicRoutes
        }
        </body>
        </html>
    );
}
