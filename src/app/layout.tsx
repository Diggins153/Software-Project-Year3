import { auth } from "@/lib/auth";
import { alikeAngular, artifika } from "@/lib/fonts";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Session } from "next-auth";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
    title: {
        template: "%s ⩿ BD&D",
        default: "BeyonD&D",
    },
    applicationName: "BeyonD&D",
    appleWebApp: {
        capable: true,
        title: "BeyonD&D",
    },
};

export const viewport: Viewport = {
    colorScheme: "dark",
};

export default async function RootLayout({ appRoutes, children }: Readonly<{
    children: ReactNode,
    appRoutes: ReactNode
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
            className={ `${ alikeAngular.variable } ${ artifika.variable } ${ artifika.className } antialiased overflow-clip flex flex-col md:flex-row h-dvh w-dvw` }
        >
        {
            !!session?.user
                ? appRoutes
                : children
        }
        <Toaster richColors={ true }/>
        </body>
        </html>
    );
}
