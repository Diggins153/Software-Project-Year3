import { ReactNode } from "react";

export default function CharactersLayout({ children }: { children: Readonly<ReactNode> }) {
    return <div>
        { children }
    </div>;
};