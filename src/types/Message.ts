export type Message = {
    id: number;

    message: string;

    sent_at: Date;

    campaign_id: number;

    author_id: number;

    author_name?: string;

    author_handle?: string;
}