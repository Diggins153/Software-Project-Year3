import { alikeAngular, artifika } from "@/lib/fonts";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body
            className={ `${ alikeAngular.variable } ${ artifika.variable } antialiased` }
        >
        { children }
        </body>
        </html>
    );
}
