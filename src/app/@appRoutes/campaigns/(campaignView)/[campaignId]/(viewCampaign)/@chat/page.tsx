import MessageForm from "@/components/campaign-chat/MessageForm";
import MessagesList from "@/components/campaign-chat/MessagesList";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import query from "@/lib/database";
import { ensureSession } from "@/lib/utils";
import { Character } from "@/types/Character";
import { Message } from "@/types/Message";

interface CampaignChatProps {
    params: Promise<{ campaignId: number }>;
}

export default async function CampaignChat({ params }: CampaignChatProps) {
    const { user } = await ensureSession();
    const { campaignId } = await params;

    const characters = await query<Character[]>(`
        SELECT c.*
        FROM campaign_characters cc
                 JOIN \`character\` c ON c.id = cc.character_id
        WHERE cc.campaign_id = ?
          AND owner_id = ?
          AND cc.status = 'joined'
    `, campaignId, user.id);

    if (characters.length == 0) return null;

    const messages = await query<Message[]>(`
        SELECT m.*,
               c.name   AS author_name,
               c.handle AS author_handle
        FROM messages m
                 JOIN \`character\` c ON c.id = m.author_id
        WHERE campaign_id = ?
        ORDER BY m.sent_at DESC
    `, campaignId) ?? [];

    return <>
        <ResizableHandle withHandle/>
        <ResizablePanel
            defaultSize={ 20 }
            maxSize={ 30 }
            minSize={ 15 }
            collapsible
            className="content ml-2"
        >
            <aside className="flex flex-col flex-1 overflow-y-scroll">
                <MessagesList initialMessages={ messages } campaignId={ campaignId.toString() }/>
                <MessageForm characters={ characters } campaignId={ campaignId }/>
            </aside>
        </ResizablePanel>
    </>;
}