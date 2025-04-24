import IIndexable from "@/types/IIndexable";

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

export function getContentTypeDialogName(type: ContentType) {
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
}

export function getReasons(type: ContentType): IIndexable<string> {
    switch (type) {
        case ContentType.USER:
            return {
                "name": "Offensive or Inappropriate name",
                "behaviour": "Inappropriate behaviour",
                "harassment": "Harassment or Bullying",
                "discrimination": "Hate Speech or Discrimination",
                "violence": "Violence or Threatening Behavior",
                "other": "Other (Please describe)",
            };
        case ContentType.CHARACTER:
            return {
                "name": "Offensive or Inappropriate Name",
                "image": "Inappropriate Image",
                "bio-offensive": "Offensive Bio",
                "bio-inappropriate": "Discriminatory or Inappropriate Bio",
                "handle": "Offensive handle",
                "other": "Other (Please describe)",
            };
        case ContentType.CAMPAIGN:
            return {
                "name": "Offensive or Inappropriate Name",
                "outline": "Offensive Outline",
                "banner": "Offensive Banner",
                "other": "Other (Please describe)",
            };
        case ContentType.SESSION:
            return {
                "title": "Offensive or Inappropriate Title",
                "excerpt": "Offensive or Inappropriate Excerpt",
                "writeup": "Offensive or Inappropriate Writeup",
                "other": "Other (Please describe)",
            };
        case ContentType.MESSAGE:
            return {
                "behaviour": "Inappropriate Behaviour",
                "harassment": "Harassment or Bullying",
                "discrimination": "Hate Speech or Discrimination",
                "other": "Other (Please describe)",
            };
    }
}
