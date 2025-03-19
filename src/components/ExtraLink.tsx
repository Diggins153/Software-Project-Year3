import Link from "next/link";
import { ReactElement, ReactNode } from "react";

interface ExtraLinkProps {
    href: string;
    icon: ReactElement;
    children?: ReactNode;
    inNewTab: boolean;
}

/**
 * Displays icon after the link.
 * @param href
 * @param icon
 * @param children
 * @param inNewTab
 * @constructor
 */
export default function ExtraLink({ href, icon, children, inNewTab = false }: ExtraLinkProps) {
    return <Link
        href={ href }
        target={ inNewTab ? "_blank" : "_self" }
        className="inline-flex underline"
    ><span>{ children }</span><span className="scale-75">{ icon }</span></Link>;
}