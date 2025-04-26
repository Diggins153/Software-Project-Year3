import RegistrationForm from "@/components/forms/RegistrationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register",
};

export default function RegisterPage() {
    return <div className="m-auto flex flex-col gap-8">
        <h2 className="text-2xl">Register</h2>
        <RegistrationForm/>
    </div>;
}
