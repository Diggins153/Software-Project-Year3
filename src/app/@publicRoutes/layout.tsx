import { buttonVariants } from "@/components/ui/button";
import { alikeAngular, artifika } from "@/lib/fonts";
import Link from "next/link";

export default async function NoLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return <div className="flex flex-col h-dvh">
        <header className="mx-1.5 mt-1.5 bg-theme p-1.5 rounded-lg">
            <nav className={ `flex justify-between items-center px-1 ${ artifika.className }` }>
                <div className="flex items-center gap-5">
                    <p className={ `text-2xl font-bold select-none ${ alikeAngular.className }` }>BeyonD&D</p>
                    <Link href="/" className={ buttonVariants({ variant: "link" }) }>Home</Link>
                </div>
                <div className="flex gap-5">
                    <Link href="/register" className={ buttonVariants({ variant: "default" }) }>Register</Link>
                    <Link href="/login" className={ buttonVariants({ variant: "outline" }) }>Log In</Link>
                </div>
            </nav>
        </header>
        <div className="content mr-0 mx-1.5 w-auto">
            { children }
        </div>
    </div>;
}
