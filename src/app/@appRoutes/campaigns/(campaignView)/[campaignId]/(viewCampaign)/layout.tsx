import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ensureSession } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

interface ViewCampaignLayoutProps {
    children: Readonly<ReactNode>;
    chat: ReactNode;
    params: Promise<{ campaignId?: number }>;
}

export default async function ViewCampaignLayout({ children, params, chat }: ViewCampaignLayoutProps) {
    await ensureSession();
    const { campaignId } = await params;

    if (!campaignId) {
        redirect("/");
    }

    return <div className="w-full">
        <ResizablePanelGroup direction="horizontal" autoSaveId={ campaignId.toString() }>
            <ResizablePanel defaultSize={ 80 } className="content">
                { children }
            </ResizablePanel>
            <ResizableHandle withHandle/>
            <ResizablePanel defaultSize={ 20 } maxSize={ 30 } minSize={ 15 } collapsible className="content ml-2">
                <Suspense fallback={ <LoadingChat/> }>
                    { chat }
                </Suspense>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>;
}

function LoadingChat() {
    return <aside className="flex flex-col justify-center items-center my-auto">
        <Loader2 className="animate-spin mb-4"/>
        <p>Loading chat</p>
    </aside>;
}