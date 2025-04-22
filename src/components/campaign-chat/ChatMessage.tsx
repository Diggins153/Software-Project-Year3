import { Message } from "@/types/Message";
import Link from "next/link";

interface ChatMessageProps {
    message: Message;
    showAuthor?: boolean;
}

export default function ChatMessage({ message, showAuthor = true }: ChatMessageProps) {
    const { id, message: text, sent_at, campaign_id, author_id, author_name, author_handle } = message;
    const formatter = new Intl.DateTimeFormat("en-UK", { dateStyle: "medium", timeStyle: "short" });

    return <div className="">
        { showAuthor &&
            <>
                <div className="mt-2"></div>
                <Link href={ `/characters/${ author_id }` } className="text-sm text-muted-foreground">
                    { author_name }
                </Link>
            </>
        }
        <div className="bg-yellow-200 text-black py-1 px-2 rounded-lg flex justify-between items-end flex-wrap">
            { text }<span className="text-xs text-muted ms-auto">{ formatter.format(sent_at) }</span>
        </div>
    </div>;
}