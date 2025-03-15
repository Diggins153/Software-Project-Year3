import CampaignForm from "@/components/campaigns/CampaignForm";

/**
 * CreateCampaignPage renders the page for creating a new campaign
 *
 * This page displays a heading "New Campaign" and includes the CampaignFor
 * component, which contains the form logic for campaign creation
 *
 * @returns {JSX.Element} The rendered CreateCampaignPage component
 */
export default function CreateCampaignPage() {
    return <main className="w-full md:w-1/2 mx-auto">
        <h1 className="text-3xl mb-4">New Campaign</h1>
        <CampaignForm/>
    </main>;
}