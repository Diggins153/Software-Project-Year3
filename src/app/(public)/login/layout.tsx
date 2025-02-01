import { Metadata } from "next";
import Page from "./page";

export const metadata: Metadata = {
    title: "Log into BYonD&D",
};

export default async function LoginLayout() {
    return <Page/>;
}
