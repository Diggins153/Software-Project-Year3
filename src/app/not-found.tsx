"use client";

import NoLayout from "@/app/(public)/layout";
import { alikeAngular } from "@/lib/fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
    const router = useRouter();

    return <NoLayout>
        <main className="content md:ml-2 p-10">
            <h1 className={ `text-3xl font-bold ${ alikeAngular.className } mb-8` }>Page not found</h1>
            <p className="text-lg mb-2">This page does not exists even in the vast expanse of the multiverse.</p>
            <ul className="list-disc list-inside">
                <p className="text-lg mb-2">You can:</p>
                <li><Link href="/" className="text-blue-300">Show me a path back home</Link></li>
                <li><span className="cursor-pointer text-blue-300" onClick={ router.back }>Go back a page</span></li>
            </ul>
        </main>
    </NoLayout>;
}