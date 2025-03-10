"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

import { SessionFormSchema } from "@/lib/formSchemas";
import { createSession } from "@/lib/actions/sessions";

type CreateSessionFormProps = {
    campaignId: number;
};

export default function CreateSessionForm({ campaignId }: CreateSessionFormProps) {
    const form = useForm<z.infer<typeof SessionFormSchema>>({
        resolver: zodResolver(SessionFormSchema),
        defaultValues: {
            title: "",
            excerpt: "",
            writeup: "",
            sessionDate: "",
            signupDeadline: "",
        },
    });

    async function onSubmit(data: z.infer<typeof SessionFormSchema>) {
        const response = await createSession(data, campaignId);
        if (response.ok) {
            toast.success(response.message);
            redirect(response.redirect!);
        } else {
            toast.error(response.message);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Session Title</FormLabel>
                            <FormControl>
                                <Input required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Excerpt */}
                <FormField
                    name="excerpt"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Excerpt</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Writeup */}
                <FormField
                    name="writeup"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Detailed Writeup</FormLabel>
                            <FormControl>
                                <Textarea {...field} rows={6} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Session Date */}
                <FormField
                    name="sessionDate"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Session Date/Time</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Signup Deadline */}
                <FormField
                    name="signupDeadline"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Signup Deadline</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-col lg:flex-row gap-2">
                    <Link href={`/campaigns/view?campaignId=${campaignId}`} className={`${buttonVariants({ variant: "outline" })} flex-grow`}>
                        Cancel
                    </Link>
                    <Button className="flex-grow" type="submit">
                        Create Session
                    </Button>
                </div>
            </form>
        </Form>
    );
}
