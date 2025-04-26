"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/lib/actions/users";
import { UpdateUserFormSchema } from "@/lib/formSchemas";
import { User } from "@/types/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";


export default function UpdateUserForm({ user }: { user: User }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    const router = useRouter();
    const form = useForm<z.infer<typeof UpdateUserFormSchema>>({
        resolver: zodResolver(UpdateUserFormSchema),
        defaultValues: {
            id: user.id,
            displayName: user.display_name,
            email: user.email,
            password: "",
            passwordCheck: "",
        },
    });

    async function handleUserUpdate(data: z.infer<typeof UpdateUserFormSchema>) {
        const response = await updateUser(data);

        if (response.ok) {
            toast.success("Updated");
            if (form.getValues("password") !== "") {
                useEffect(() => {
                    setTimeout(() => window.location.reload(), 3000);
                }, []);
            } else {
                router.refresh();
            }
        } else {
            toast.error(response.message);
        }
    }

    return <Form { ...form }>
        <form onSubmit={ form.handleSubmit(handleUserUpdate) } className="space-y-8">
            <FormField
                control={ form.control }
                name="displayName"
                render={ ({ field }) => (
                    <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                            <Input { ...field }/>
                        </FormControl>
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
                            <Input type="email" { ...field }/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                ) }
            />

            <FormField
                control={ form.control }
                name="password"
                render={ ({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input type={showPassword ? "text" : "password"}{...field} className="pr-10"/>
                                <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-2 top-1/2 -translate-y-1/2" tabIndex={-1}>
                                    {showPassword
                                        ?(<EyeOffIcon className="h-5 w-5" />):
                                        (<EyeIcon className="h-5 w-5" />)
                                    }
                                </button>
                            </div>
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
                            <div className="relative">
                                <Input type={showPasswordCheck ? "text" : "password"}{...field} className="pr-10"/>
                                <button type="button" onClick={() => setShowPasswordCheck(prev => !prev)} className="absolute right-2 top-1/2 -translate-y-1/2" tabIndex={-1}>
                                    {showPasswordCheck ?
                                        (<EyeOffIcon className="h-5 w-5" />):
                                        (<EyeIcon className="h-5 w-5" />)
                                    }
                                </button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    </Form>;
}