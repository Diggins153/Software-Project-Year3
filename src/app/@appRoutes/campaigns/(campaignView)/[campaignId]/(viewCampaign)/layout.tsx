"use client";

import { Button } from "@/components/ui/button";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useIsMobile } from "@/lib/hooks";
import { getPanelGroupElement } from "react-resizable-panels";
import { Loader2, MessageCircleIcon, XIcon } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { ReactNode, Suspense, useEffect, useState } from "react";

interface ViewCampaignLayoutProps {
    children: Readonly<ReactNode>;
    chat?: ReactNode;
}

export default function ViewCampaignLayout({ children, chat }: ViewCampaignLayoutProps) {
    const { campaignId } = useParams();
    const isMobile = useIsMobile();
    const [ chatVisible, setChatVisible ] = useState(false);
    const [ x, setX ] = useState(0);
    const [ y, setY ] = useState(0);
    const chatButtonPadding = 7;

    if (!campaignId) {
        redirect("/campaigns");
    }

    useEffect(() => {
        function setCoords() {
            const el = getPanelGroupElement("campaignChatGroup")?.getBoundingClientRect() ?? null;
            if (el != null) {
                setX(el.right - 40 - chatButtonPadding);
                if (chatVisible) {
                    setY(el.top + chatButtonPadding);
                } else {
                    setY(el.top + el.height - 40 - chatButtonPadding);
                }
            }
        }

        setCoords();
        window.addEventListener("resize", setCoords);
        return () => window.removeEventListener("resize", setCoords);
    }, [ chatVisible ]);

    if (isMobile)
        return <ResizablePanelGroup
            id="campaignChatGroup"
            direction="horizontal"
            autoSaveId={ campaignId.toString() }
            className="order-1 md:order-2"
        >
            { chatVisible
                ? <Suspense fallback={ <LoadingChat/> }>
                    { chat }
                </Suspense>
                : <ResizablePanel
                    id="campaign"
                    order={ 1 }
                    defaultSize={ 80 }
                    className="content !order-1"
                >
                    { children }
                </ResizablePanel>
            }
            <Button
                className="absolute rounded-full z-50 float-left"
                style={ { top: `${ y }px`, left: `${ x }px` } }
                onClick={ () => setChatVisible(!chatVisible) }
                size="icon"
            >
                { chatVisible
                    ? <XIcon/>
                    : <MessageCircleIcon/>
                }
            </Button>
        </ResizablePanelGroup>;

    return <ResizablePanelGroup
        id="campaignChatGroup"
        direction="horizontal"
        autoSaveId={ campaignId.toString() }
        className="order-1 md:order-2"
    >
        <ResizablePanel
            id="campaign"
            order={ 1 }
            defaultSize={ 80 }
            className="content !order-1"
        >
            { children }
        </ResizablePanel>
        <Suspense fallback={ <LoadingChat/> }>
            { chat }
        </Suspense>
    </ResizablePanelGroup>;
}

function LoadingChat() {
    return <aside className="flex flex-col justify-center items-center my-auto">
        <Loader2 className="animate-spin mb-4"/>
        <p>Loading chat</p>
    </aside>;
}