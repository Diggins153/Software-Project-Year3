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

export const getContentTypeDialogName = (type: ContentType) => {
    switch (type) {
        case ContentType.USER:
            return "Report a User";
        case ContentType.CHARACTER:
            return "Report a Character";
        case ContentType.CAMPAIGN:
            return "Report a Campaign";
        case ContentType.SESSION:
            return "Report a Session";
        case ContentType.MESSAGE:
            return "Report a Message";
    }
};

export const campaignReasons = {
    "name": "Offensive Name",
    "outline": "Offensive Outline",
    "banner": "Offensive Banner",
};