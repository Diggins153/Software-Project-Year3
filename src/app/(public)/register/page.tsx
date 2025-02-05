import RegistrationForm from "@/components/forms/RegistrationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register into BYonD&D",
};

export default function RegisterPage() {
    return <div className="mx-auto flex flex-col gap-8">
        <h2 className="text-2xl">Register</h2>
        <RegistrationForm/>
    </div>;
}
