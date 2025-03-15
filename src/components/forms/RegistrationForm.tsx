"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { register } from "@/lib/actions/authentication";
import { RegisterFormSchema } from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, CircleHelp } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function RegistrationForm() {
    const form = useForm<z.infer<typeof RegisterFormSchema>>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            displayName: "",
            email: "",
            password: "",
            passwordCheck: "",
            gdpr: false,
        },
    });

    return <Form { ...form }>
        <form onSubmit={ form.handleSubmit(register) } className="space-y-8">
            <FormField
                control={ form.control }
                name="displayName"
                render={ ({ field }) => (
                    <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                            <Input required max="40" { ...field }/>
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
                control={ form.control }
                name="email"
                render={ ({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input required type="email" max="64" { ...field }/>
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
                control={ form.control }
                name="password"
                render={ ({ field }) => (
                    <FormItem>
                        <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="text-accent-foreground" type="button">
                                        <CircleHelp
                                            size={ 20 }
                                            className="ml-2"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent onClick={ () => undefined }>
                                        <ul className="list-disc list-inside">
                                            Make sure your password has
                                            <li>At least 10 characters</li>
                                            <li>A lower-case letter</li>
                                            <li>An upper-case letter</li>
                                            <li>A digit</li>
                                            <li>A special character</li>
                                        </ul>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <FormControl>
                            <Input type="password" { ...field }/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                ) }
            />

            <FormField
                control={ form.control }
                name="passwordCheck"
                render={ ({ field }) => (
                    <FormItem>
                        <FormLabel>Repeat Password</FormLabel>
                        <FormControl>
                            <Input type="password" { ...field }/>
                        </FormControl >
                        <FormMessage/>
                    </FormItem>
                ) }
            />

            <FormField
                control={ form.control }
                name="gdpr"
                render={ ({ field }) => (
                    <FormItem>
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={ field.value } onCheckedChange={ field.onChange }/>
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    I agree to the <a className="underline" href="javascript:void(0);">Terms of
                                    Service</a> and <a className="underline" href="javascript:void(0);">Privacy
                                    Policy</a>.
                                </FormLabel>
                            </div>
                        </div>
                        <FormMessage/>
                    </FormItem>
                ) }
            />

            <div className="flex justify-between">
                <Link href="/login" className={ buttonVariants({ variant: "outline" }) }>
                    I want to log in
                </Link>
                <Button type="submit">Register <ArrowRightIcon/></Button>
            </div>
        </form>
    </Form>;
}
