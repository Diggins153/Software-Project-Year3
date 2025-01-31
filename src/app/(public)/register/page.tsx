"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { register } from "@/lib/actions/authentication";
import { registerFormSchema } from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function RegisterPage() {
    const form = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            displayName: "",
            email: "",
            password: "",
        },
    });

    return <>
        <h1>Registration page yippee!</h1>

        <Form { ...form }>
            <form onSubmit={ form.handleSubmit(register) } method="post">
                <FormField
                    control={ form.control } name="displayName" render={ ({ field }) => (
                    <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                            <Input max="40" { ...field }/>
                        </FormControl>
                        <FormDescription>
                            How will others see you. <br/>
                            This is different from your characters' name.
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                ) }
                />
                <FormField
                    control={ form.control } name="email" render={ ({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" max="64" { ...field }/>
                        </FormControl>
                        <FormDescription>
                            You will use this email for log in. <br/>
                            We will use this email to send you a verification code.
                        </FormDescription>
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
                        <FormDescription>
                            Make sure your password has:
                            <ul className="list-inside list-disc">
                                <li>At least 10 characters</li>
                                <li>A lower-case letter</li>
                                <li>An upper-case letter</li>
                                <li>A digit</li>
                                <li>A special character</li>
                            </ul>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                ) }
                />

                <div className="flex gap-2">
                    <Button type="button" variant="outline">Go to Login</Button>
                    <Button type="submit">Register</Button>
                </div>
            </form>
        </Form>
    </>;
}
