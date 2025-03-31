import CampaignForm from "@/components/campaigns/CampaignForm";
import TopBar from "@/components/TopBar";

/**
 * CreateCampaignPage renders the page for creating a new campaign
 *
 * This page displays a heading "New Campaign" and includes the CampaignFor
 * component, which contains the form logic for campaign creation
 *
 * @returns {JSX.Element} The rendered CreateCampaignPage component
 */
export default function CreateCampaignPage() {
    return <main>
        <TopBar title={ "Create Campaign" } backText={ "Campaigns" } backLink={ "/campaigns" }/>
        <div className="w-full md:w-1/2 mx-auto">
            <CampaignForm/>
        </div>
    </main>;
}