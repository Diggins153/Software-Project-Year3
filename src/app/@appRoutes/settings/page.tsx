import DeleteAccountDialog from "@/components/settings/DeleteAccountDialog";
import UpdateUserForm from "@/components/settings/UpdateUserForm";
import TopBar from "@/components/TopBar";
import { ensureSession } from "@/lib/utils";
import { User } from "@/types/User";

/**
 * Settings page where users can update their details or delete their account.
 * @returns {Promise<JSX.Element>} - The settings page UI.
 */
export default async function SettingsPage() {
    const { user } = await ensureSession();

    return <main className="content">
        <TopBar title="Settings"/>
        <div className="p-1.5 w-full md:w-3/4 lg:w-1/2 xl:w-2/5 mx-auto space-y-4">
            <h2 className="text-xl font-bold">Update Details</h2>
            <UpdateUserForm user={ { ...user, id: Number(user.id) } as User }/>

            <DeleteAccountDialog/>
        </div>
    </main>;
}
