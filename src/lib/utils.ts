import { auth } from "@/lib/auth";
import { clsx, type ClassValue } from "clsx";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateCampaignInviteCode(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < 7; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

/**
 * Ensures session and user is set. If session is unset, redirects the user to a specified page.
 * @param redirectTo - Where the user is redirected if session is undefined.
 * @return Session object
 */
export async function ensureSession(redirectTo: string = "/"): Promise<Required<Session>> {
    let session = await auth();

    if (!session || !session.user) {
        if (typeof window === "undefined") {
            redirect(redirectTo);
        } else {
            const { useRouter } = await import("next/navigation");
            const router = useRouter();
            router.push(redirectTo);
        }
        throw Error("Could not fetch session.");
    }

    return <Required<Session>>session;
}
