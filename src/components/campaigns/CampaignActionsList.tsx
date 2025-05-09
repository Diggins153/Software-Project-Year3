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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { deleteCampaign, transferOwnership } from "@/lib/actions/campaigns";
import { TransferOwnershipFormSchema } from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
/**
 * Campaign actions component, allowing the transfer of campaign ownership
 *
 * @param {{ campaignId: number }} props - The campaign ID
 * @returns {JSX.Element} - The campaign actions list UI
 */
export default function CampaignActionsList({ campaignId }: { campaignId: number }) {
    const router = useRouter();
    const [ isTransferOpen, setTransferOpen ] = useState(false);
    const [ isDeleteOpen, setDeleteOpen ] = useState(false);
    const form = useForm<z.infer<typeof TransferOwnershipFormSchema>>({
        resolver: zodResolver(TransferOwnershipFormSchema),
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            campaignId: campaignId,
            newOwnerEmail: "",
            // @ts-ignore
            confirmation: "",
        },
    });
    /**
     * Handles the ownership transfer process
     *
     * @param {z.infer<typeof TransferOwnershipFormSchema>} formData - The form data for ownership transfer
     */
    async function handleOwnershipTransfer(formData: z.infer<typeof TransferOwnershipFormSchema>) {
        const response = await transferOwnership(formData);

        if (response.ok) {
            router.push(response.redirectTo);
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
    }

    async function handleCampaignDelete() {
        setDeleteOpen(false);
        const response = await deleteCampaign(campaignId);

        if (response.ok) {
            toast.success(response.message);
            if (response.redirect) router.replace(response.redirect);
        } else {
            toast.error(response.message);
        }
    }

    return <>
        <div className="border rounded-lg grid grid-cols-1 divide-y">
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Transfer Ownership
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Transfer ownership of this campaign to another user
                    </p>
                </div>
                <Button variant="destructive" onClick={ () => setTransferOpen(true) }>Transfer</Button>
            </div>
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Delete Campaign
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Delete this campaign and all data
                    </p>
                </div>
                <Button variant="destructive" onClick={ () => setDeleteOpen(true) }>Delete</Button>
            </div>
        </div>

        <Dialog
            open={ isTransferOpen } onOpenChange={ open => {
            setTransferOpen(open);
            form.reset();
        } }
        >
            <DialogContent className="bg-theme">
                <DialogHeader>
                    <DialogTitle>Transfer Ownership</DialogTitle>
                    <DialogDescription>This operation is irreversible!</DialogDescription>
                </DialogHeader>
                <Form { ...form }>
                    <form onSubmit={ form.handleSubmit(handleOwnershipTransfer) } className="space-y-8">
                        <FormField
                            control={ form.control }
                            name="newOwnerEmail"
                            render={ ({ field }) =>
                                <FormItem>
                                    <FormLabel>New Owner Email</FormLabel>
                                    <FormControl>
                                        <Input { ...field }/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            }
                        />

                        <FormField
                            control={ form.control }
                            name="confirmation"
                            render={ ({ field }) =>
                                <FormItem>
                                    <FormLabel>
                                        Please type "confirm transfer" to confirm
                                    </FormLabel>
                                    <FormControl>
                                        <Input { ...field }/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            }
                        />

                        <Button
                            type="submit"
                            variant="destructive"
                            className="w-full !mt-2"
                            size="sm"
                            disabled={ !form.formState.isValid }
                        >
                            Transfer
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

        <AlertDialog open={ isDeleteOpen } onOpenChange={ open => setDeleteOpen(open) }>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete all data associated with this campaign. This action cannot be undone!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={ handleCampaignDelete }>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>;
};
