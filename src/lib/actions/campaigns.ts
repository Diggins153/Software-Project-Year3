import { CampaignFormSchema } from "@/lib/formSchemas";
import { z } from "zod";

export async function createCampaign(formValues: z.infer<typeof CampaignFormSchema>) {
    const parseResult = CampaignFormSchema.safeParse(formValues);

    if (!parseResult.success) return { ok: false, errors: parseResult.error.format() };

    const { name, banner, outline, maxPlayers, signupsOpen } = parseResult.data;

    console.log("Name", name);
    console.log("Banner", banner);

    return { ok: true };
}