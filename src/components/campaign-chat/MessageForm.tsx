"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { sendMessage } from "@/lib/actions/chat";
import { Character } from "@/types/Character";
import { SendHorizonalIcon } from "lucide-react";
import Form from "next/form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface MessageFormProps {
    characters: Character[];
    campaignId: number;
}

export default function MessageForm({ characters, campaignId }: MessageFormProps) {
    const textarea = useRef<HTMLTextAreaElement>(null);
    const [ shouldReset, setShouldReset ] = useState(false);

    function setTextareaHeight(el: HTMLTextAreaElement) {
        el.style.height = "1px";
        el.style.height = `calc(0.5rem + ${ el.scrollHeight }px)`;
    }

    async function handleSendMessage(formData: FormData) {
        const response = await sendMessage(formData);
        if (!response.ok) {
            if (response.errors) {
                //     return { errors: response.errors };
                console.log(response.errors);
            }
            if (response.message) {
                toast.error(response.message);
            }
        }

        setShouldReset(true);
    }

    useEffect(() => {
        if (shouldReset && textarea.current) {
            textarea.current.value = "";
            setTextareaHeight(textarea.current);
            setShouldReset(false);
        }
    }, [ shouldReset ]);

    return <Form className="sticky bottom-0 bg-theme/80 p-1 backdrop-blur-sm" action={ handleSendMessage }>
        <input type="hidden" name="campaignId" value={ campaignId }/>
        <Textarea
            id="chatInput"
            placeholder="Message"
            className="mb-1 resize-none max-h-[35dvh]"
            onChange={ (event) => setTextareaHeight(event.target) }
            ref={ textarea }
            name="message"
            required
        ></Textarea>
        <div className="flex items-center">
            <div className="text-xs">As:</div>
            <Select disabled={ characters.length == 0 } name="characterId" required>
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
            <Button size="icon">
                <SendHorizonalIcon/>
                <span className="sr-only">Send message</span>
            </Button>
        </div>
    </Form>;
}