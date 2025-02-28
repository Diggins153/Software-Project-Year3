"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Class } from "@/entities/Class";
import Image from "next/image";
import { useState } from "react";

export default function ClassTokens({ classes }: { classes: Class[] }) {
    const [ rand ] = useState(Math.random());

    return <div className="flex -space-x-[15px] hover:space-x-0.5">
        { classes.map(({ name }, index) => (
            <div key={ `${ rand }-${ name }` } style={ { zIndex: classes.length - index } }>
                <TooltipProvider>
                    <Tooltip delayDuration={ 0 } disableHoverableContent={ true }>
                        <TooltipTrigger className="cursor-default" type="button">
                            <div className="bg-white border-2 rounded-full p-1">
                                <Image
                                    className="aspect-square min-w-[25px]"
                                    src={ `/classes/${ name }.svg` }
                                    alt=""
                                    width={ 25 }
                                    height={ 25 }
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            { name }
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        )) }
    </div>;
}