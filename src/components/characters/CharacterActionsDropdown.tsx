"use client";

import EditCharacterForm from "@/components/characters/EditCharacterForm";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCharacter } from "@/lib/actions/characters";
import { Character } from "@/types/Character";
import { Race } from "@/types/Race";
import { Ellipsis, PencilIcon, Trash2Icon } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CharacterActionsDropdown({ character, races }: { character: Character, races: Race[] }) {
    const [ isOpen, setOpen ] = useState(false);

    async function handleEdit() {
        console.log("Editing character");
    }

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
                <Button variant="ghost"><Ellipsis size={ 24 }/></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={ () => setOpen(true) }>
                    <PencilIcon/>
                    <span>Edit</span>
                </DropdownMenuItem>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-red-300" onSelect={ e => e.preventDefault() }>
                            <Trash2Icon/>
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Do you really want to delete this character?
                                <b className="block text-destructive mt-2">This cannot be undone.</b>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={ handleDelete }>Delete my character</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>

            <Dialog open={ isOpen } onOpenChange={ open => setOpen(open) }>
                <DialogContent className="bg-theme">
                    <DialogHeader>
                        <DialogTitle>Edit Character</DialogTitle>
                    </DialogHeader>
                    <EditCharacterForm character={ character } races={ races } onSubmit={ () => setOpen(false) }/>
                </DialogContent>
            </Dialog>
        </DropdownMenu>

    </>;
}