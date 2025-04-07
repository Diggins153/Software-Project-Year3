import CampaignChat from "@/components/campaigns/CampaignChat";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import query from "@/lib/database";
import { ensureSession } from "@/lib/utils";
import { Character } from "@/types/Character";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface ViewCampaignLayoutProps {
    children: Readonly<ReactNode>;
    params: Promise<{ campaignId?: number }>;
}

export default async function ViewCampaignLayout({ children, params }: ViewCampaignLayoutProps) {
    const { user } = await ensureSession();
    const { campaignId } = await params;

    if (!campaignId) {
        redirect("/");
    }

    const characters = await query<Character[]>(`
        SELECT *
        FROM \`character\`
        WHERE owner_id = ?
    `, user.id);

    return <div className="w-full">
        <ResizablePanelGroup direction="horizontal" autoSaveId={ campaignId.toString() }>
            <ResizablePanel defaultSize={ 80 } className="content">
                { children }
            </ResizablePanel>
            <ResizableHandle withHandle/>
            <ResizablePanel defaultSize={ 20 } maxSize={ 30 } minSize={ 15 } collapsible className="content ml-2">
                <CampaignChat campaignId={ campaignId } characters={ characters }/>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>;
}