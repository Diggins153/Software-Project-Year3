import { signOut } from "@/lib/auth";
import NavItem from "@/components/NavItem";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { alikeAngular } from "@/lib/fonts";
import { CogIcon, DoorOpenIcon, KeyIcon, LogOutIcon, SwordsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Sidebar() {
    return (
        <div className="h-dvh flex flex-col gap-4 p-2.5">
            <nav className="flex flex-col gap-5 h-full justify-center">
                <div className="flex flex-col gap-1">
                    <TooltipProvider delayDuration={ 0 }>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/"
                                    className={ `${ alikeAngular.className } text-4xl font-bold text-white bg-[#330F0A] rounded-lg text-center px-5 py-3 select-none` }
                                >
                                    B
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent
                                side="right"
                                className={ `text-2xl text-white bg-[#330F0A] font-bold ${ alikeAngular.className }` }
                            >
                                <p>ByonD&D - Home</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="flex flex-col gap-1">
                    <NavItem title="Campaigns" href="/campaigns" icon={ <SwordsIcon size={ 24 }/> }/>
                    <NavItem title="Characters" href="/characters" icon={ <UsersIcon size={ 24 }/> }/>
                </div>
                <div className="flex flex-col gap-1">
                    <NavItem title="Settings" href="/settings" icon={ <CogIcon size={ 24 }/> }/>
                    <form
                        action={ async () => {
                            "use server";
                            await signOut();
                            throw redirect("/");
                        } }
                    >
                        <NavItem title="Sign Out" icon={ <LogOutIcon size={ 24 }/> }/>
                    </form>
                </div>
            </nav>
        </div>
    );
}
