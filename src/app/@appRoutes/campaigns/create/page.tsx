import CampaignForm from "@/components/campaigns/CampaignForm";

export default function CreateCampaignPage() {
    return <main className="w-full md:w-1/2 mx-auto">
        <h1 className="text-3xl mb-4">New Campaign</h1>
        <CampaignForm/>
    </main>;
}