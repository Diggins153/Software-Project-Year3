"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions/authentication";
import { LoginFormSchema } from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function handleLoginSubmit(formData: z.infer<typeof LoginFormSchema>) {
        const response = await login(formData);

        if (!response.ok) {
            toast.error(response.message, { richColors: true });
            return response;
        }

    }

    return <Form { ...form }>
        <form onSubmit={ form.handleSubmit(handleLoginSubmit) } className="space-y-8">
            <FormField
                control={ form.control } name="email" render={ ({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" { ...field }/>
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
                        <div className="relative">
                            <Input type={showPassword ? "text" : "password"}{...field} className="pr-10"/>
                            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-2 top-1/2 -translate-y-1/2" tabIndex={-1}>
                                {showPassword ?
                                    (<EyeOffIcon className="h-5 w-5" />) :
                                    (<EyeIcon className="h-5 w-5" />)
                                }
                            </button>
                        </div>
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
