"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginFormSchema } from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function LoginPage() {
    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return <>
        <h1>Login page yippee!</h1>

        <Form { ...form }>
            <form onSubmit={ form.handleSubmit(onSubmit) }>
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

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    </>;
}
