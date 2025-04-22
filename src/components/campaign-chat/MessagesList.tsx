"use client";

import ChatMessage from "@/components/campaign-chat/ChatMessage";
import { Message } from "@/types/Message";
import { useEffect, useRef, useState } from "react";

export default function MessagesList({ initialMessages }: { initialMessages: Message[] }) {
    const [ messages, setMessages ] = useState<Message[]>(initialMessages);
    const scrollDownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

    }, []);

    return <div className="flex-1 flex flex-col-reverse justify-start p-1">
        <div ref={ scrollDownRef }></div>
        { initialMessages.map((message, index, array) => {
            let showAuthor: boolean;

            try {
                showAuthor = array[index + 1].author_id !== message.author_id;
            } catch (e) {
                showAuthor = true;
            }

            return <ChatMessage
                key={ message.id }
                message={ message }
                showAuthor={ showAuthor }
            />;
        }) }
    </div>;
}