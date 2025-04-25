import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ensureSession } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

interface ViewCampaignLayoutProps {
    children: Readonly<ReactNode>;
    chat?: ReactNode;
    params: Promise<{ campaignId?: number }>;
}

export default async function ViewCampaignLayout({ children, params, chat }: ViewCampaignLayoutProps) {
    await ensureSession();
    const { campaignId } = await params;

    if (!campaignId) {
        redirect("/");
    }

    return <>
        <ResizablePanelGroup direction="horizontal" autoSaveId={ campaignId.toString() } className="order-1 md:order-2">
            <ResizablePanel id="campaign" order={1} defaultSize={ 80 } className="content !order-1">
                { children }
            </ResizablePanel>
            <Suspense fallback={ <LoadingChat/> }>
                { chat }
            </Suspense>
        </ResizablePanelGroup>
    </>;
}

function LoadingChat() {
    return <aside className="flex flex-col justify-center items-center my-auto">
        <Loader2 className="animate-spin mb-4"/>
        <p>Loading chat</p>
    </aside>;
}