import DeleteAccountDialog from "@/components/settings/DeleteAccountDialog";
import UpdateUserForm from "@/components/settings/UpdateUserForm";
import { ensureSession } from "@/lib/utils";
import { User } from "@/types/User";

export default async function SettingsPage() {
    const { user } = await ensureSession();

    return <main>
        <div className="bg-theme flex p-2 sticky top-0">
            <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <div className="p-1.5 w-full md:w-3/4 lg:w-1/2 xl:w-2/5 mx-auto space-y-4">
            <h2 className="text-xl font-bold">Update Details</h2>
            <UpdateUserForm user={ { ...user, id: Number(user.id) } as User }/>

            <DeleteAccountDialog/>
        </div>
    </main>;
}
