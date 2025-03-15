"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createCampaign, updateCampaign } from "@/lib/actions/campaigns";
import { CampaignFormSchema } from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type UpdateCampaignFormProps = {
    formData?: z.infer<typeof CampaignFormSchema>,
    asEditForm?: boolean,
    campaignId?: number,
}

export default function CampaignForm({ formData, asEditForm = false, campaignId }: UpdateCampaignFormProps) {
    const router = useRouter();
    const defaultValues = !!formData ? formData : {
        name: "",
        outline: "",
        banner: "",
        maxPlayers: 4,
        signupsOpen: true,
        isPublic: false,
    };
    const form = useForm<z.infer<typeof CampaignFormSchema>>({
        resolver: zodResolver(CampaignFormSchema),
        defaultValues: defaultValues,
    });
    const bannerRef = form.register("banner");

    async function formSubmit(data: z.infer<typeof CampaignFormSchema>) {
        if (asEditForm) {
            const response = await updateCampaign(campaignId!, data);

            if (response.ok) {
                router.refresh();
                toast.success("Campaign updated");
            } else {
                toast.error(response.message);
            }
        } else {
            const response = await createCampaign(data);

            if (response.ok) {
                toast(response.message);
                redirect(response.redirect!);
            }
        }
    }

    return <Form { ...form }>
        <form onSubmit={ form.handleSubmit(formSubmit) } className="space-y-8">
            <FormField
                name="banner"
                control={ form.control }
                render={ () =>
                    <FormItem>
                        <FormLabel>Banner</FormLabel>
                        <FormControl>
                            <Input type="file" { ...bannerRef }/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                name="name"
                control={ form.control }
                render={ ({ field }) =>
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input required { ...field }/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                control={ form.control }
                name="maxPlayers"
                render={ ({ field }) =>
                    <FormItem>
                        <FormLabel>Player Count</FormLabel>
                        <FormControl>
                            <Input type="number" min="1" { ...field }/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                name="outline"
                control={ form.control }
                render={ ({ field }) =>
                    <FormItem>
                        <FormLabel>Campaign Outline</FormLabel>
                        <FormControl>
                            <Textarea { ...field } rows={ 10 }/>
                        </FormControl>
                        <FormDescription>Add a capturing hook for your potential players.</FormDescription>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                name="signupsOpen"
                control={ form.control }
                render={ ({ field }) =>
                    <FormItem>
                        <div className="flex items-center space-x-4">
                            <FormControl>
                                <Switch checked={ field.value } onCheckedChange={ field.onChange }/>
                            </FormControl>
                            <FormLabel>Signups Open</FormLabel>
                        </div>
                        <FormMessage/>
                    </FormItem>
                }
            />

            <FormField
                name="isPublic"
                control={ form.control }
                render={ ({ field }) =>
                    <FormItem>
                        <div className="flex items-center space-x-4">
                            <FormControl>
                                <Switch checked={ field.value } onCheckedChange={ field.onChange }/>
                            </FormControl>
                            <FormLabel>Public Campaign</FormLabel>
                        </div>
                        <FormDescription>Whether the campaign is viewable by outside users</FormDescription>
                        <FormMessage/>
                    </FormItem>
                }
            />

            { !asEditForm ?
                <div className="flex flex-col lg:flex-row gap-2">
                    <Link href="/campaigns" className={ `${ buttonVariants({ variant: "outline" }) } flex-grow` }>
                        Cancel
                    </Link>
                    <Button
                        className="flex-grow"
                        type="submit"
                    >
                        { form.formState.isSubmitting && <Loader2 className="animate-spin"/> }
                        Create
                    </Button>
                </div>
                : <div className="flex justify-end">
                    <Button type="submit">
                        Save Changes
                    </Button>
                </div>
            }
        </form>
    </Form>;
}