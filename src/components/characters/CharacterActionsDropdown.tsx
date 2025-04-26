"use client";

import EditCharacterForm from "@/components/characters/EditCharacterForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCharacter } from "@/lib/actions/characters";
import { Campaign } from "@/types/Campaign";
import { Character } from "@/types/Character";
import { Class } from "@/types/Class";
import { Race } from "@/types/Race";
import { AlertCircle, Ellipsis, PencilIcon, ShapesIcon, Trash2Icon } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CharacterActionsDropdown({ character, races, classes, characterCampaigns }: {
    character: Character,
    races: Race[],
    classes: Class[],
    characterCampaigns: Campaign[],
}) {
    const [ isDetailsOpen, setDetailsOpen ] = useState(false);
    const [ isLevelsOpen, setLevelsOpen ] = useState(false);
    const [ isDeleteOpen, setDeleteOpen ] = useState(false);

    async function handleDelete() {
        const response = await deleteCharacter(character.id);

        if (response.ok) {
            toast(response.message);
            redirect(response.redirect);
        } else {
            toast.error(response.message);
        }
    }

    return <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost"><Ellipsis/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={ () => setDetailsOpen(true) }>
                    <PencilIcon/>
                    <span>Edit Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={ () => setLevelsOpen(true) } disabled className="hidden">
                    <ShapesIcon/>
                    <span>Edit Levels</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-300" onSelect={ () => setDeleteOpen(true) }>
                    <Trash2Icon/>
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>

            <Dialog open={ isDetailsOpen } onOpenChange={ open => setDetailsOpen(open) }>
                <DialogContent className="bg-theme">
                    <DialogHeader>
                        <DialogTitle>Edit Character</DialogTitle>
                    </DialogHeader>
                    <EditCharacterForm
                        character={ character }
                        races={ races }
                        onSubmit={ () => setDetailsOpen(false) }
                        classes={ classes }
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={ isLevelsOpen } onOpenChange={ open => setLevelsOpen(open) }>
                <DialogContent className="bg-theme">
                    <DialogHeader>
                        <DialogTitle>Edit Levels</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <Dialog open={ isDeleteOpen } onOpenChange={ open => setDeleteOpen(open) }>
                <DialogContent className="bg-theme">
                    <DialogHeader>
                        <DialogTitle>Do you really want to delete { character.name }?</DialogTitle>
                    </DialogHeader>
                    { characterCampaigns.length > 0 &&
                        <>
                            The character is playing
                            in { characterCampaigns.length == 1 ? "this campaign" : "these campaigns" }:
                            <ul className="list-disc list-inside">
                                { characterCampaigns.map(campaign =>
                                    <li key={ campaign.id }>{ campaign.name }</li>) }
                            </ul>
                            <span className="font-bold">The character will be removed and you can loose access to the campaign.</span>
                        </>
                    }
                    <Alert variant="destructive" className="light">
                        <AlertCircle className="size-4"/>
                        <AlertDescription>This cannot be undone!</AlertDescription>
                    </Alert>
                    <div className="flex gap-4 justify-end">
                        <DialogClose>Cancel</DialogClose>
                        <Button onClick={ handleDelete } variant="destructive">Delete my character</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </DropdownMenu>
    </>;
}