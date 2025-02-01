"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
    const [ showDropdown, setShowDropdown ] = useState(false);

    return (
        <div className="sidebar">
            <div className="sidebar-header">BeyonD&D</div>
            <nav>
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/campaigns">Campaigns</Link></li>

                    {/* Characters Dropdown */ }
                    <li
                        className="dropdown"
                        onMouseEnter={ () => setShowDropdown(true) }
                        onMouseLeave={ () => setShowDropdown(false) }
                    >
                        <Link href="/character">Characters</Link>
                        { showDropdown && (
                            <ul className="dropdown-menu">
                                <li><Link href="#">Character 1</Link></li>
                                <li><Link href="#">Character 2</Link></li>
                                <li><Link href="#">Character 3</Link></li>
                            </ul>
                        ) }
                    </li>

                    <li><Link href="/contact">Contact</Link></li>
                    <li><Link href="/dashboard">Dashboard</Link></li>
                    <li><Link href="/login">Login</Link></li>
                    <li><Link href="/register">Register</Link></li>
                </ul>
            </nav>

            <div className="bottom-link">
                <Link href="/settings">Settings</Link>
                <Button type="button" variant="ghost" onClick={ () => signOut() }>Log Out</Button>
            </div>
        </div>
    );
}
