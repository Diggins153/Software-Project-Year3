import ReportContent from "@/components/reports/ReportContent";
import { artifika } from "@/lib/fonts";
import { Message } from "@/types/Message";
import { ContentType } from "@/types/Report";
import Link from "next/link";

interface ChatMessageProps {
    message: Message;
    showAuthor?: boolean;
}

export default function ChatMessage({ message, showAuthor = true }: ChatMessageProps) {
    const { id, message: text, sent_at, campaign_id, author_id, author_name, author_handle } = message;
    const formatter = new Intl.DateTimeFormat("en-UK", { dateStyle: "medium", timeStyle: "short" });

    return <>
        <div className="bg-yellow-200 text-black py-1 px-2 rounded-lg flex justify-between items-center flex-wrap mb-1">
            <pre className={ `text-wrap ${ artifika.className }` }>{ text }</pre>
            <div className="shrink ms-auto flex items-center gap-1">
                <span className="text-xs text-muted ">{ formatter.format(sent_at) }</span>
                <ReportContent
                    contentId={ id }
                    contentType={ ContentType.MESSAGE }
                    className="text-muted bg-transparent hover:bg-accent hover:text-foreground"
                    size="tiny"
                />
            </div>
        </div>
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
    </>;
}