"use client";

import ChatMessage from "@/components/campaign-chat/ChatMessage";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Character } from "@/types/Character";
import { Message } from "@/types/Message";
import { SendHorizonalIcon } from "lucide-react";
import { useState } from "react";

interface CampaignChatProps {
    campaignId: number;
    characters: Character[];
}

const messages: Message[] = [
    { id: 1, campaign_id: 0, author_id: 1, author_name: "Author 1", author_handle: "author1", message: "Message 1", sent_at: new Date(2025, 3, 9, 17, 45) },
    { id: 2, campaign_id: 0, author_id: 2, author_name: "Author 2", author_handle: "author2", message: "Message 2", sent_at: new Date(2025, 3, 9, 17, 46) },
    { id: 3, campaign_id: 0, author_id: 1, author_name: "Author 1", author_handle: "author1", message: "Some really really long text. This demonstrates wrapping of the text with the sent date.", sent_at: new Date(2025, 3, 9, 17, 47) },
    { id: 4, campaign_id: 0, author_id: 1, author_name: "Author 1", author_handle: "author1", message: "Message 4", sent_at: new Date(2025, 3, 9, 17, 47) },
];

export default function CampaignChat({ campaignId, characters }: CampaignChatProps) {
    const [ character, setCharacter ] = useState<string>(characters?.[0]?.id.toString() ?? undefined);
    const [ message, setMessage ] = useState<string>("");

    return <aside className="p-1 flex flex-col flex-1">
        <div className="flex-1 flex flex-col justify-end gap-1">
            { messages.map((message, index, array) => {
                let showAuthor: boolean;

                try {
                    showAuthor = array[index - 1].author_id !== message.author_id;
                } catch (e) {
                    showAuthor = true;
                }

                return <ChatMessage
                    key={ message.id }
                    message={ message }
                    showAuthor={ showAuthor }
                />;
            }) }
        </div>
        <Textarea
            placeholder="Message"
            className="my-2"
            value={ message }
            onChange={ e => setMessage(e.target.value) }
        ></Textarea>
        <div className="flex items-center">
            <div className="text-xs">As:</div>
            <Select value={ character } onValueChange={ setCharacter } disabled={ characters.length == 0 }>
                <SelectTrigger>
                    <SelectValue placeholder={ characters.length > 0 ? "Character" : "No Characters to Display" }/>
                </SelectTrigger>
                <SelectContent>
                    { characters.map(character => (
                        <SelectItem
                            key={ character.id }
                            value={ character.id.toString() }
                        >
                            { character.name }
                        </SelectItem>
                    )) }
                </SelectContent>
            </Select>
            <Button disabled={ character == undefined || message.length == 0 } size="icon">
                <SendHorizonalIcon/>
                <span className="sr-only">Send message</span>
            </Button>
        </div>
    </aside>;
}