"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Character } from "@/types/Character";
import { SendHorizonalIcon } from "lucide-react";
import { useState } from "react";

interface CampaignChatProps {
    campaignId: number;
    characters: Character[];
}

export default function CampaignChat({ campaignId, characters }: CampaignChatProps) {
    const [ character, setCharacter ] = useState<string>(characters?.[0].id.toString());

    return <aside className="p-1 flex flex-col flex-1">
        <div className="flex-1 flex flex-col-reverse">
            <div>Message 1</div>
            <div>Message 2</div>
            <div>Message 3</div>
        </div>
        <Textarea placeholder="Message" className="my-2"></Textarea>
        <div className="flex items-center">
            <div className="text-xs">As:</div>
            <Select value={ character } onValueChange={ setCharacter }>
                <SelectTrigger>
                    <SelectValue placeholder="Character"/>
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
            <Button disabled={ character == undefined }><SendHorizonalIcon/></Button>
        </div>
    </aside>;
}