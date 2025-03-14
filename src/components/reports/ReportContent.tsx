"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { sendReport } from "@/lib/actions/reports";
import { ReportContentFormSchema } from "@/lib/formSchemas";
import { ContentType, getContentTypeDialogName, getReasons } from "@/types/Report";
import { zodResolver } from "@hookform/resolvers/zod";
import { FlagIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ReportCampaignProps = {
    contentType: ContentType;
    contentId: number;
}

export default function ReportContent({ contentType, contentId }: ReportCampaignProps) {
    const [ isOpen, setOpen ] = useState(false);
    const form = useForm<z.infer<typeof ReportContentFormSchema>>({
        resolver: zodResolver(ReportContentFormSchema),
        defaultValues: {
            contentType: contentType,
            contentId: contentId,
            reason: "",
            userDescription: "",
        },
    });
    const reasons = getReasons(contentType);

    async function handleSubmitReport(data: z.infer<typeof ReportContentFormSchema>) {
        const response = await sendReport(data);

        if (response.ok) toast.success(response.message);
        else toast.error(response.message);
        form.reset();
        setOpen(false);
    }

    return <Dialog open={ isOpen } onOpenChange={ open => setOpen(open) }>
        <DialogTrigger className={ buttonVariants({ variant: "destructive" }) }><FlagIcon/></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{ getContentTypeDialogName(contentType) }</DialogTitle>
            </DialogHeader>

            <Form { ...form }>
                <form onSubmit={ form.handleSubmit(handleSubmitReport) } className="space-y-8">
                    <FormField
                        control={ form.control }
                        name="reason"
                        render={ ({ field }) =>
                            <FormItem>
                                <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a reason"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        { Object.keys(reasons).map(key => (
                                            <SelectItem key={ key } value={ key }>
                                                { reasons[key] }
                                            </SelectItem>
                                        )) }
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        }
                    />

                    <FormField
                        control={ form.control }
                        name="userDescription"
                        render={ ({ field }) =>
                            <FormItem>
                                <FormLabel>Description (optional)</FormLabel>
                                <FormDescription>Would you like to provide more context?</FormDescription>
                                <FormControl>
                                    <Textarea { ...field }/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        }
                    />

                    <Button type="submit" className="w-full">
                        Send Report
                        { form.formState.isSubmitting && <Loader2 className="animate-spin"/> }
                    </Button>
                </form>
            </Form>

        </DialogContent>
    </Dialog>;
}