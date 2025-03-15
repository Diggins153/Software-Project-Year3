export type CampaignCharacters = {
    character_id: number;
    character_name?: string;
    campaign_id: number;
    status: CharacterStatus;
}

export enum CharacterStatus {
    INVITED = "invited",
    JOINED = "joined",
    KICKED = "kicked",
    ABANDONED = "abandoned",
    BANNED = "banned",
}