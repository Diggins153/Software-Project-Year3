import { artifika } from "@/lib/fonts";
import { Message } from "@/types/Message";
import Link from "next/link";

interface ChatMessageProps {
    message: Message;
    showAuthor?: boolean;
}

export default function ChatMessage({ message, showAuthor = true }: ChatMessageProps) {
    const { id, message: text, sent_at, campaign_id, author_id, author_name, author_handle } = message;
    const formatter = new Intl.DateTimeFormat("en-UK", { dateStyle: "medium", timeStyle: "short" });

    return <>
        { showAuthor &&
            <>
                <Link
                    href={ `/characters/${ author_id }` }
                    className="text-sm text-foreground sticky top-0 pt-2 pb-1 bg-theme"
                >
                    { author_name }
                </Link>
            </>
        }
        <div className="bg-yellow-200 text-black py-1 px-2 rounded-lg flex justify-between items-end flex-wrap mb-1">
            <pre className={ `text-wrap ${ artifika.className }` }>{ text }</pre>
            <span className="text-xs text-muted ms-auto">{ formatter.format(sent_at) }</span>
        </div>
    </>;
}