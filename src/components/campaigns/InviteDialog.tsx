"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import CopyButton from "@/components/ui/copy-button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { regenerateInviteCode } from "@/lib/actions/campaigns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function InviteDialog({ inviteCode, campaignId }: { inviteCode: string, campaignId: number }) {
    const [ inviteLink, setInviteLink ] = useState("");
    const [ isGenerating, setGenerating ] = useState(false);
    const router = useRouter();

    useEffect(() => setInviteLink(`${ window.location.host }/invite/${ inviteCode }`));

    async function handleRenerateClick() {
        if (isGenerating) return;

        setGenerating(true);
        const response = await regenerateInviteCode(campaignId);

        if (response.ok) {
            router.refresh();
        } else {
            toast.error("Something failed");
        }
        setGenerating(false);
    }

    return <Dialog defaultOpen>
        <DialogTrigger className={ buttonVariants({ variant: "default" }) }>Invite</DialogTrigger>
        <DialogContent className="bg-theme">
            <DialogHeader>
                <DialogTitle>Invite players</DialogTitle>
            </DialogHeader>
            <Tabs>
                <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="link">Link</TabsTrigger>
                    <TabsTrigger value="email" disabled>Email</TabsTrigger>
                </TabsList>
                <TabsContent value="link" className="space-y-4">
                    <div className="flex w-full items-center space-x-2">
                        <Input value={ inviteLink } contentEditable={ false } readOnly/>
                        <CopyButton value={ inviteLink }/>
                    </div>
                    <div className="text-sm text-center">
                        <span
                            className={ cn("w-min hover:underline cursor-pointer", { "text-muted, hover:no-underline cursor-wait": isGenerating }) }
                            onClick={ handleRenerateClick }
                        >
                            Invalidate and regenerate code
                        </span>
                    </div>
                </TabsContent>
                <TabsContent value="email"></TabsContent>
            </Tabs>
        </DialogContent>
    </Dialog>;
}
