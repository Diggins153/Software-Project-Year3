"use client";

import ChatMessage from "@/components/campaign-chat/ChatMessage";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Character } from "@/types/Character";
import { Message } from "@/types/Message";
import { SendHorizonalIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";

interface CampaignChatProps {
    campaignId: number;
    characters: Character[];
    initialMessages?: Message[];
}

export default function CampaignChat({ campaignId, characters, initialMessages }: CampaignChatProps) {
    const [ character, setCharacter ] = useState<string>(characters?.[0]?.id.toString() ?? undefined);
    const [ message, setMessage ] = useState<string>("");
    const [ messages, setMessages ] = useState<Message[]>(initialMessages ?? []);

    function handleMessageChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setMessage(e.target.value);
        e.target.style.height = "1px";
        e.target.style.height = `calc(0.5rem + ${ e.target.scrollHeight }px)`;
    }

    return <aside className="flex flex-col flex-1 overflow-y-scroll">
        <div className="flex-1 flex flex-col justify-end p-1">
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
        <div className="sticky bottom-0 bg-theme/80 p-1 backdrop-blur-sm">
            <Textarea
                placeholder="Message"
                className="mb-1 resize-none max-h-[35dvh]"
                value={ message }
                onChange={ e => handleMessageChange(e) }
            ></Textarea>
            <div className="flex items-center">
                <div className="text-xs">As:</div>
                <Select value={ character } onValueChange={ setCharacter } disabled={ characters.length == 0 }>
                    <SelectTrigger className="mx-1">
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
        </div>
    </aside>;
}