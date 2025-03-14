export type Report = {
    id: number;

    content_type: ContentType;

    content_id: number;

    reason: string;

    user_description: string;

    author_id: number;
}

export enum ContentType {
    USER = "user",
    CHARACTER = "character",
    CAMPAIGN = "campaign",
    SESSION = "session",
    MESSAGE = "message",
}

export const campaignReasons = {
    "name": "Offensive Name",
    "outline": "Offensive Outline",
    "banner": "Offensive Banner",
};