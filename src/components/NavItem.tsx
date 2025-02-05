"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { artifika } from "@/lib/fonts";
import Link from "next/link";
import { PropsWithoutRef } from "react";

export default function NavItem({ title, href, icon }: PropsWithoutRef<{ title: string, href?: string, icon?: any }>) {

    return <>
        <TooltipProvider delayDuration={ 0 }>
            <Tooltip>
                <TooltipTrigger asChild>
                    { !!href
                        ? <Link
                            href={ href }
                            className="!flex bg-green-800 text-white px-5 py-3 justify-center rounded-lg"
                        >
                            { !!icon
                                ? <div>{ icon }</div>
                                : "" }
                        </Link>
                        : <button
                            type="submit"
                            className="!flex bg-green-800 text-white px-5 py-3 justify-center rounded-lg"
                        >
                            { !!icon
                                ? <div className="">{ icon }</div>
                                : "" }
                        </button>
                    }
                </TooltipTrigger>
                <TooltipContent side={ "right" } className={ `bg-green-800 text-white text-md select-none ${artifika.className}` }>
                    <p>{ title }</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </>;
}
