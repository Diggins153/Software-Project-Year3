import { BaseEntity } from "@/entities/BaseEntity";
import { Campaign } from "@/entities/Campaign";
import { Character } from "@/entities/Character";

export class User extends BaseEntity {
    displayName: string;

    email: string;

    password: string;

    role: UserRole = UserRole.USER;

    isPaying: boolean = false;

    lastConsentDate: Date;

    getCharacters(): Character[] {
        return [];
    }

    getCampaigns(): Campaign[] {
        return [];
    }

    constructor(displayName: string, email: string, password: string, lastConsentDate: Date) {
        super();
        this.displayName = displayName;
        this.email = email;
        this.password = password;
        this.lastConsentDate = lastConsentDate;
    }
}

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}
