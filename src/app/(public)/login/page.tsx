"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions/authentication";
import { LoginFormSchema } from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function LoginPage() {
    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return <div className="mx-auto flex flex-col gap-8">
        <h2 className="text-2xl">Login</h2>

        <Form { ...form }>
            <form onSubmit={ form.handleSubmit(login) }>
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

                <Link href={ "/register" } className={ buttonVariants({ variant: "outline" }) }>
                    I want to register
                </Link>
                <Button type="submit">Log in</Button>
            </form>
        </Form>
    </div>;
}
