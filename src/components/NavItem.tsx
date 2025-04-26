"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithoutRef } from "react";

export default function NavItem({ title, href, icon }: PropsWithoutRef<{ title: string, href?: string, icon?: any }>) {
    const pathname = usePathname();
    const isMobile = useIsMobile();

    return <>
        <TooltipProvider delayDuration={ 0 } disableHoverableContent={ true }>
            <Tooltip>
                <TooltipTrigger asChild>
                    { !!href
                        ? <Link
                            href={ href }
                            className={ cn(
                                "!flex bg-green-800 text-white px-5 py-3 justify-center rounded-lg w-full",
                                { "bg-theme": pathname.startsWith(href) },
                            ) }
                        >
                            { !!icon
                                ? <div>{ icon }</div>
                                : "" }
                        </Link>
                        : <button
                            type="submit"
                            className="!flex bg-green-800 text-white px-5 py-3 justify-center rounded-lg w-full"
                        >
                            { !!icon
                                ? <div className="">{ icon }</div>
                                : "" }
                        </button>
                    }
                </TooltipTrigger>
                <TooltipContent
                    side={ isMobile ? "top" : "right" }
                    className="bg-green-800 text-white text-md select-none"
                >
                    <p>{ title }</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </>;
}
