"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export default function CampaignActionsList() {
    const [ isTransferOpen, setTransferOpen ] = useState(false);
    const campaignId = 7;

    return <>
        <div className="border rounded-lg grid grid-cols-1 divide-y">
            <div className="flex items-center space-x-4 p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Transfer Ownership
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Transfer ownership of this campaign to a another user
                    </p>
                </div>
                <Button variant="destructive" onClick={ () => setTransferOpen(true) }>Transfer</Button>
            </div>
        </div>

        <Dialog open={ isTransferOpen } onOpenChange={ open => setTransferOpen(open) }>
            <DialogContent className="bg-theme">
                <DialogHeader>
                    <DialogTitle>Transfer Ownership</DialogTitle>
                </DialogHeader>

            </DialogContent>
        </Dialog>
    </>;
};
