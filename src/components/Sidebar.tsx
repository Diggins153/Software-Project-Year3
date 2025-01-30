"use client";

import { HomeIcon, SwordsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    const links = [
        { href: "/", icon: HomeIcon, title: "Home" },
        { href: "/campaigns", icon: SwordsIcon, title: "Campaigns" },
        { href: "/characters", icon: UsersIcon, title: "Characters" },
    ];

    return (
        <>
            <ul className="flex gap-2">
                { links.map(link => (
                        <li key={ link.title }>
                            <Link href={ link.href } className={ `flex ${ pathname == link.href ? "bg-teal-800" : "" }` }>
                                <link.icon className="me-5"/>
                                { link.title }
                            </Link>
                        </li>
                    ),
                ) }
            </ul>
        </>
    );
}
