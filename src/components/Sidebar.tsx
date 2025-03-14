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
        <div className="h-dvh flex flex-col gap-4 p-2.5">
            <nav className="flex flex-col gap-5 h-full justify-center">
                <div className="flex flex-col gap-1">
                    <TooltipProvider delayDuration={ 0 } disableHoverableContent={ true }>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/"
                                    className={ `${ alikeAngular.className } text-4xl font-bold text-white bg-[#330F0A] rounded-lg text-center px-5 py-3 select-none border-2 border-white` }
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
                <div className="flex flex-col gap-1">
                    <NavItem title="Campaigns" href="/campaigns" icon={ <SwordsIcon/> }/>
                    <NavItem title="Characters" href="/characters" icon={ <UsersIcon/> }/>
                </div>
                <div className="flex flex-col gap-1">
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
