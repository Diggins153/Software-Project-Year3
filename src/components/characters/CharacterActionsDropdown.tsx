"use client";

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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, PencilIcon, Trash2Icon } from "lucide-react";

export default function CharacterActionsDropdown({ characterId }: { characterId: number }) {
    async function handleEdit() {
        console.log("Editing character");
    }

    async function handleDelete() {
        console.log("Deleting character");
    }

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost"><Ellipsis size={ 24 }/></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem onSelect={ handleEdit }>
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
    </DropdownMenu>;
}