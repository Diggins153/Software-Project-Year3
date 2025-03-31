import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface TopBarParams {
    title: string;
    backText?: string;
    backLink?: string;
    endContent?: ReactNode;
}

export default function TopBar({ title, backLink, backText, endContent }: TopBarParams) {
    return <div className="flex items-center justify-between p-2 sticky top-0 bg-theme z-50">
        <div className="flex items-center gap-2 md:gap-4">
            { backText && backLink &&
                <Link href={ backLink } className={ buttonVariants({ variant: "ghost" }) }>
                    <ArrowLeftIcon/><span className="hidden lg:inline">{ backText }</span>
                </Link>
            }
            <h1 className="text-2xl font-bold">{ title }</h1>
        </div>
        <div>{ endContent && (endContent) }</div>
    </div>;
}