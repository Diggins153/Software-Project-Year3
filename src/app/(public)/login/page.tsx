import LoginForm from "@/components/forms/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Log into BYonD&D",
};

export default function LoginPage() {
    return <div className="m-auto flex flex-col gap-8">
        <h2 className="text-2xl">Login</h2>
        <LoginForm/>
    </div>;
}
