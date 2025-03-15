"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";

async function copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
}

interface CopyButtonProps extends ButtonProps {
    value: string;
}

/**
 * Button that copies the specified value to clipboard
 * @param value The value to be copied
 */
export default function CopyButton({ value }: CopyButtonProps) {
    const [ hasCopied, setHasCopied ] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    }, [ hasCopied ]);

    return <Button
        onClick={ () => {
            copyToClipboard(value);
            setHasCopied(true);
        } }
    >
        { hasCopied ? <CheckIcon/> : <CopyIcon/> }
    </Button>;
}