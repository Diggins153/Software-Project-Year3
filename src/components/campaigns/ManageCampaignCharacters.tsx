"use client";

import { buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    banPlayer,
    type CampaignPlayerResponse,
    cancelInvitation,
    kickPlayer,
    removeBan,
} from "@/lib/actions/campaignPlayers";
import { CharacterStatus } from "@/types/CampaignCharacters";
import { Character } from "@/types/Character";
import { CircleXIcon, EllipsisIcon, LogOutIcon, OctagonMinusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { toast } from "sonner";

export default function ManageCampaignCharacters({ status, character, campaignId }: {
    status: CharacterStatus,
    character: Character,
    campaignId: number
}) {
    const router = useRouter();

    function handleActionResponse(response: CampaignPlayerResponse) {
        if (response.ok) {
            toast.success(response.message);
            router.refresh();
        } else {
            toast.error(response.message);
        }
    }

    async function handleKick() {
        const response = await kickPlayer(campaignId, character.id);
        handleActionResponse(response);
    }

    async function handleBan() {
        const response = await banPlayer(campaignId, character.id);
        handleActionResponse(response);
    }

    async function handleRemoveBan() {
        const response = await removeBan(campaignId, character.id);
        handleActionResponse(response);

    }

    async function handleCancelInvitation() {
        const response = await cancelInvitation(campaignId, character.id);
        handleActionResponse(response);
    }

    function renderCharacterOptions() {
        const options: ReactElement[] = [];
        switch (status) {
            case CharacterStatus.JOINED:
                options.push(
                    <DropdownMenuItem key="kick" onSelect={ handleKick }>
                        <LogOutIcon/>Kick Character
                    </DropdownMenuItem>,
                );
            // noinspection FallThroughInSwitchStatementJS
            case CharacterStatus.KICKED:
            case CharacterStatus.ABANDONED:
                options.push(
                    <DropdownMenuItem key="ban" onSelect={ handleBan }>
                        <OctagonMinusIcon/>Ban Character
                    </DropdownMenuItem>,
                );
                break;
            case CharacterStatus.BANNED:
                options.push(
                    <DropdownMenuItem key="removeBan" onSelect={ handleRemoveBan }>
                        Remove Character Ban
                    </DropdownMenuItem>,
                );
                break;
            case CharacterStatus.INVITED:
                options.push(
                    <DropdownMenuItem key="cancelInvite" onSelect={ handleCancelInvitation }>
                        <CircleXIcon/>Cancel Invitation
                    </DropdownMenuItem>,
                );
                break;
        }

        return options;
    }

    return <DropdownMenu>
        <DropdownMenuTrigger className={ buttonVariants({ variant: "ghost" }) }><EllipsisIcon/></DropdownMenuTrigger>
        <DropdownMenuContent className="text-red-300">
            { renderCharacterOptions() }
        </DropdownMenuContent>
    </DropdownMenu>;
}