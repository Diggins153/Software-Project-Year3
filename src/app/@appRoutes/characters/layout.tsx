import { ReactNode } from "react";

export default function CharactersLayout({ children }: { children: Readonly<ReactNode> }) {
    return <div className="p-1.5">
        { children }
    </div>;
};