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
}

const messages: Message[] = [
    {
        id: 1,
        campaign_id: 0,
        author_id: 1,
        author_name: "Author 1",
        author_handle: "author1",
        message: "Message 1",
        sent_at: new Date(2025, 3, 9, 17, 45),
    },
    {
        id: 2,
        campaign_id: 0,
        author_id: 2,
        author_name: "Author 2",
        author_handle: "author2",
        message: "Message 2",
        sent_at: new Date(2025, 3, 9, 17, 46),
    },
    {
        id: 3,
        campaign_id: 0,
        author_id: 1,
        author_name: "Author 1",
        author_handle: "author1",
        message: "Some really really long text. This demonstrates wrapping of the text with the sent date.",
        sent_at: new Date(2025, 3, 9, 17, 47),
    },
    {
        id: 4,
        campaign_id: 0,
        author_id: 1,
        author_name: "Author 1",
        author_handle: "author1",
        message: "Message 4\n" +
            "This really long message demonstrates scrolling the chat view\n" +
            "\n" +
            "Totam velit aut doloribus. Totam ea nisi atque non nihil veniam quasi et. Repellendus voluptas sint autem voluptates. Ut tenetur reprehenderit quod amet magni laborum molestiae.\n" +
            "\n" +
            "Provident quisquam accusantium corporis impedit deserunt voluptatem. Aliquid sapiente provident provident at doloremque porro. Neque et voluptatem distinctio qui neque. Impedit consequatur iusto consectetur et aut. Qui sint nisi eius possimus repellat.\n" +
            "\n" +
            "Error placeat rerum tempore molestias harum accusamus sed quo. Voluptatibus possimus iure aliquid in itaque corporis cupiditate. Qui necessitatibus et eos odio possimus minima ducimus.\n" +
            "\n" +
            "Ullam rerum aut tempora itaque fugiat. Ut dolores et sint porro. Rerum cumque aspernatur et id. Amet repellat debitis vel corrupti. Mollitia voluptates nihil rem rerum. Porro aut quia aut facilis iusto dolorem quod molestiae.\n" +
            "\n" +
            "Unde autem ut dolor quisquam. Rerum et placeat voluptatum aut voluptas. Ut temporibus officia occaecati iste placeat. Quam aut ut nemo. Dolorum quibusdam animi voluptatem qui impedit fuga ea quo. Assumenda doloremque mollitia eos repellendus eos.\n",
        sent_at: new Date(2025, 3, 9, 17, 47),
    },
];

export default function CampaignChat({ campaignId, characters }: CampaignChatProps) {
    const [ character, setCharacter ] = useState<string>(characters?.[0]?.id.toString() ?? undefined);
    const [ message, setMessage ] = useState<string>("");

    function handleMessageChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setMessage(e.target.value);
        e.target.style.height = "1px";
        e.target.style.height = `calc(0.5rem + ${ e.target.scrollHeight }px)`;
    }

    return <aside className="flex flex-col flex-1 overflow-y-scroll">
        <div className="flex-1 flex flex-col justify-end gap-1 p-1">
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