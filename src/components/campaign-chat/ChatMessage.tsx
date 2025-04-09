import { Message } from "@/types/Message";
import Link from "next/link";

interface ChatMessageProps {
    message: Message;
    showAuthor?: boolean;
}

export default function ChatMessage({ message, showAuthor = true }: ChatMessageProps) {
    const { id, message: text, sent_at, campaign_id, author_id, author_name, author_handle } = message;
    const formatter = new Intl.DateTimeFormat("en-UK");

    return <div className="">
        { showAuthor &&
            <Link href={ `/characters/${ author_id }` } className="text-sm text-muted-foreground mt-7">
                { author_name }
            </Link>
        }
        <div className="bg-yellow-200 text-black py-1 px-2 rounded-lg flex justify-between items-end flex-wrap ">
            { text }<span className="text-xs text-muted">{ formatter.format(sent_at) }</span>
        </div>
    </div>;
}