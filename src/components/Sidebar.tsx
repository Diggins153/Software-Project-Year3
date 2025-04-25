import { signOut } from "@/lib/auth";
import NavItem from "@/components/NavItem";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { alikeAngular } from "@/lib/fonts";
import { ensureSession } from "@/lib/utils";
import { CogIcon, LogOutIcon, ShieldIcon, SwordsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

export default async function Sidebar() {
    const { user } = await ensureSession();

    return (
        <div className="flex px-1 pt-2 pb-1 md:p-2.5 w-dvw md:w-min md:h-dvh order-2 md:order-1">
            <nav className="flex flex-row justify-center w-full gap-1 md:h-full md:flex-col md:gap-5">
                <div className="sidebar__item-group">
                    <TooltipProvider delayDuration={ 0 } disableHoverableContent={ true }>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/"
                                    className={ `${ alikeAngular.className } text-2xl md:text-4xl font-bold text-white bg-[#330F0A] rounded-lg px-5 md:py-3 pt-1.5 select-none border-2 border-white` }
                                >
                                    B
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent
                                side="right"
                                className={ `text-2xl text-white bg-[#330F0A] font-bold border-white ${ alikeAngular.className }` }
                            >
                                <p>ByonD&D - Home</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="sidebar__item-group">
                    <NavItem title="Campaigns" href="/campaigns" icon={ <SwordsIcon/> }/>
                    <NavItem title="Characters" href="/characters" icon={ <UsersIcon/> }/>
                </div>
                <div className="sidebar__item-group">
                    <NavItem title="Settings" href="/settings" icon={ <CogIcon/> }/>
                    { user.role === "admin" &&
                        <NavItem title="Admin" href="/admin" icon={ <ShieldIcon/> }/>
                    }
                    <form
                        action={ async () => {
                            "use server";
                            await signOut({ redirectTo: "/" });
                        } }
                    >
                        <NavItem title="Sign Out" icon={ <LogOutIcon size={ 22 }/> }/>
                    </form>
                </div>
            </nav>
        </div>
    );
}
