"use client";
import { Textarea } from "@/components/ui/textarea";
import { KeyboardEvent } from "react";

export default function ChatTextarea() {
    function setHeight(e: KeyboardEvent<HTMLTextAreaElement>) {
        e.currentTarget.style.height = "1px";
        e.currentTarget.style.height = `calc(0.5rem + ${ e.currentTarget.scrollHeight }px)`;
    }

    return <Textarea
        id="chatInput"
        placeholder="Message"
        className="mb-1 resize-none max-h-[35dvh]"
        onKeyUp={ e => setHeight(e) }
    ></Textarea>;
}