import { ReactNode } from "react";

// export const metadata: Metadata = {
//     title: "Create a character",
// };

export default async function CreateLayout({ children }: { children: Readonly<ReactNode> }) {
    return <>{ children }</>;
}