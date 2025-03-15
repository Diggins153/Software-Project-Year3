"use client";

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { deleteAccount, logOut } from "@/lib/actions/users";
import { toast } from "sonner";

export default function DeleteAccountDialog() {
    async function handleDeleteAccount() {
        const response = await deleteAccount();

        if (response.ok) {
            toast.success(response.message);
            await logOut();
        } else {
            toast.error(response.message);
        }
    }

    return <div className="border rounded-lg grid grid-cols-1 divide-y">
        <div className="flex items-center space-x-4 p-4">
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                    Delete Account
                </p>
                <p className="text-sm text-muted-foreground">
                    Delete your account and all data associated with it
                </p>
            </div>
            <AlertDialog>
                <AlertDialogTrigger className={ buttonVariants({ variant: "destructive" }) }>
                    Delete My Account
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={ handleDeleteAccount }>
                            Delete my Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </div>;
}