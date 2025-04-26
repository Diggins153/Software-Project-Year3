"use client";

import ChatMessage from "@/components/campaign-chat/ChatMessage";
import { INCOMING_MESSAGE_EVENT, pusherClient } from "@/lib/pusher";
import { Message } from "@/types/Message";
import { useEffect, useRef, useState } from "react";

interface MessagesListProps {
    campaignId: string;
    initialMessages: Message[];
}

export default function MessagesList({ campaignId, initialMessages }: MessagesListProps) {
    const [ messages, setMessages ] = useState<Message[]>(initialMessages);
    const scrollDownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        pusherClient.subscribe(`campaign-${ campaignId }`);
        scrollDownRef.current?.scrollIntoView();

        function incomingMessageHandler(message: Message) {
            message.sent_at = new Date(message.sent_at);
            setMessages(previousMessages => [ message, ...previousMessages ]);
        }

        pusherClient.bind(INCOMING_MESSAGE_EVENT, incomingMessageHandler);


        return function () {
            pusherClient.unbind(INCOMING_MESSAGE_EVENT, incomingMessageHandler);
            pusherClient.unsubscribe(`campaign-${ campaignId }`);
        };
    }, []);

    return <div className="flex-1 flex flex-col-reverse justify-start p-1">
        <div ref={ scrollDownRef }></div>
        { messages.length == 0 &&
            <p className="text-center mb-2">No messages have been sent yet</p>
        }
        { messages.map((message, index, array) => {
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