"use client";

import ExtraLink from "@/components/ExtraLink";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createCampaign, updateCampaign } from "@/lib/actions/campaigns";
import { CampaignFormSchema } from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon, Loader2 } from "lucide-react";
import { tabArrowUpRight } from "@lucide/lab";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


/**
 * Props type for CampaignForm component.
 * @property formData - The campaign form data for editing
 * @property asEditForm - Indicates if the form is used for editing an existing campaign
 * @property campaignId - The ID of the campaign being edited
 */
type CampaignFormProps = {
    formData?: z.infer<typeof CampaignFormSchema>,
    asEditForm?: boolean,
    campaignId?: number,
}

/**
 * CampaignForm component for creating or editing campaigns.
 *
 * @param {CampaignFormProps} props - Component props.
 * @returns {JSX.Element} - The campaign form UI.
 */
export default function CampaignForm({ formData, asEditForm = false, campaignId }: CampaignFormProps) {
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
    const [ bannerImageUrl, setBannerImageUr ] = useState<string>();

    useEffect(() => {
        // Is this an edit form?
        if (!!formData?.banner) {
            setBannerImageUr(formData.banner);
        }
        // No Image
        else {
            setBannerImageUr(undefined);
        }

        return () => {
            if (bannerImageUrl?.startsWith("blob:"))
                URL.revokeObjectURL(bannerImageUrl);
        };
    }, [ formData?.banner ]);

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
                redirect(response.redirect);
            } else {
                toast.error("Could not create campaign");
            }
        }
    }

    return <Form { ...form }>
        <form onSubmit={ form.handleSubmit(formSubmit) } className="space-y-8 pb-2">
            <FormField
                name="banner"
                control={ form.control }
                render={ () =>
                    <FormItem>
                        <FormLabel>Banner</FormLabel>
                        <div className="flex flex-col bg-background rounded-md px-2 border">
                            <div className="flex items-center">
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/png,image/jpeg" { ...bannerRef }
                                        className="border-none file:border file:border-solid file:active:border-accent file:rounded-md file:px-4 px-0"
                                        onChange={ e => {
                                            const file = e.target.files?.[0];
                                            setBannerImageUr(file ? URL.createObjectURL(file) : undefined);
                                        } }
                                    />
                                </FormControl>
                            </div>
                            { bannerImageUrl &&
                                <Image
                                    src={ bannerImageUrl }
                                    alt="File Input Preview"
                                    width={ 1500 }
                                    height={ 500 }
                                    className="rounded-md mb-2 mt-1 campaign-banner"
                                />
                            }
                        </div>
                        <FormDescription>
                            You can upload PNG and JPG files, capped at 4 MiB. For more details, <ExtraLink
                            href="/faq"
                            inNewTab
                            icon={ <Icon iconNode={ tabArrowUpRight }/> }
                        >check out the FAQ page</ExtraLink>.
                        </FormDescription>
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