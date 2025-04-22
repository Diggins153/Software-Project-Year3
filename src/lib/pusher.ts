import PusherServer from "pusher";
import PusherClient from "pusher-js";

const cluster = process.env.PSHR_CLUSTER ?? "eu";

export const pusherServer = new PusherServer({
    appId: process.env.PSHR_APP_ID!,
    key: process.env.NEXT_PUBLIC_PSHR_KEY!,
    secret: process.env.PSHR_SECRET!,
    cluster,
    useTLS: true,
});

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PSHR_KEY!, { cluster });

export const INCOMING_MESSAGE_EVENT: string = "message::inc";