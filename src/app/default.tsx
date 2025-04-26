import NoLayout from "@/app/(public)/layout";
import { buttonVariants } from "@/components/ui/button";
import { alikeAngular } from "@/lib/fonts";
import Link from "next/link";

export default function PublicRoutesDefault() {
    return <NoLayout>
        <main className="content md:ml-2 p-10">
            <h1 className={ `text-3xl font-bold ${ alikeAngular.className } mb-8` }>You need to be logged in</h1>
            <p className="text-lg mb-2">The Dungeon Master chuckles behind his screen:</p>
            <p className="text-lg">"And so, our hero approached the forbidden gates... only to be turned away by the
                magic of <i>Unauthorized Access</i>."</p>
            <div className="flex gap-4 mt-6">
                <Link href="/login" className={ buttonVariants({ variant: "outline", size: "lg" }) }>Log in</Link>
                <Link href="/register" className={ buttonVariants({ size: "lg" }) }>Register</Link>
            </div>
        </main>
    </NoLayout>;
};
