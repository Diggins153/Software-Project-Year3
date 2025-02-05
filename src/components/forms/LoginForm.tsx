"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions/authentication";
import { LoginFormSchema } from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function LoginForm() {
    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return <Form { ...form }>
        <form onSubmit={ form.handleSubmit(login) } className="space-y-8">
            <FormField
                control={ form.control } name="email" render={ ({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input { ...field }/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            ) }
            />

            <FormField
                control={ form.control } name="password" render={ ({ field }) => (
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" { ...field }/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            ) }
            />

            <div className="flex justify-between">
                <Link href={ "/register" } className={ buttonVariants({ variant: "outline" }) }>
                    I want to register
                </Link>
                <Button type="submit">Log in <ArrowRightIcon/></Button>
            </div>
        </form>
    </Form>;
}
