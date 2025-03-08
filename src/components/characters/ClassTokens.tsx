import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CharacterClass } from "@/types/CharacterClass";
import Image from "next/image";

export default async function ClassTokens({ classes }: { classes: CharacterClass[] }) {
    return <div className="flex -space-x-[15px] hover:space-x-0.5">
        { classes.map(async ({class_name, class_id}, index) => {
            return <div key={ `${ class_id }` } style={ { zIndex: classes.length - index } }>
                <TooltipProvider>
                    <Tooltip delayDuration={ 0 } disableHoverableContent={ true }>
                        <TooltipTrigger className="cursor-default" type="button">
                            <div className="bg-white border-2 rounded-full p-1">
                                <Image
                                    className="aspect-square min-w-[25px]"
                                    src={ `/classes/${ class_name }.svg` }
                                    alt=""
                                    width={ 25 }
                                    height={ 25 }
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            { class_name }
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>;
        }) }
    </div>;
}