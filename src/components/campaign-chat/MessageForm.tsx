import ChatTextarea from "@/components/campaign-chat/ChatTextarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Character } from "@/types/Character";
import { SendHorizonalIcon } from "lucide-react";

interface MessageFormProps {
    characters: Character[];
}

export default async function MessageForm({ characters }: MessageFormProps) {
    return <div className="sticky bottom-0 bg-theme/80 p-1 backdrop-blur-sm">
        <ChatTextarea/>
        <div className="flex items-center">
            <div className="text-xs">As:</div>
            <Select disabled={ characters.length == 0 }>
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
    </div>;
}