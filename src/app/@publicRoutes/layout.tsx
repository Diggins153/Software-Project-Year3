"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { alikeAngular, artifika } from "@/lib/fonts";
import { useIsMobile } from "@/lib/hooks";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function NoLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const isMobile = useIsMobile();
    const [ isOpen, setOpen ] = useState(false);

    function flipOpen() {
        setOpen(!isOpen);
    }

    function closeNav() {
        setOpen(false);
    }

    const navContent = <div className="flex justify-between items-center w-full flex-col md:flex-row gap-3">
        <div className="flex gap-3 flex-col md:flex-row">
            <Link href="/" className={ buttonVariants({ variant: "ghost" }) } onNavigate={ closeNav }>Home</Link>
        </div>
        <div className="flex gap-3">
            <Link href="/register" className={ buttonVariants({ variant: "default" }) } onNavigate={ closeNav }>
                Register
            </Link>
            <Link href="/login" className={ buttonVariants({ variant: "outline" }) } onNavigate={ closeNav }>
                Log In
            </Link>
        </div>
    </div>;

    return <div className="flex flex-col h-dvh w-full">
        <header className="rounded-lg mx-0.5 mt-0.5 bg-theme p-1.5 md:mx-1.5 md:mt-1.5">
            <nav className={ `flex flex-col items-start px-1 ${ artifika.className }` }>
                <div className="flex items-center justify-between w-full gap-2">
                    <Link
                        href="/"
                        className={ `text-2xl font-bold select-none ${ alikeAngular.className }` }
                        onNavigate={ closeNav }
                    >
                        BeyonD&D
                    </Link>
                    { !isMobile && navContent }
                    { isMobile
                        ? <Button onClick={ flipOpen } variant="outline" size="icon" className="bg-theme ms-auto">
                            <MenuIcon/>
                        </Button>
                        : null
                    }
                </div>
                { isMobile && isOpen &&
                    navContent
                }
            </nav>
        </header>
        <div className={ "content mx-0.5 md:mx-1.5 md:max-w-[calc(100dvw-0.375rem-0.375rem)]" }>
            { children }
        </div>
    </div>;
}
