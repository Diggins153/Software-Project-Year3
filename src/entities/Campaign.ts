import { BaseEntity } from "@/entities/BaseEntity";
import { Character } from "@/entities/Character";
import { User } from "@/entities/User";

export class Campaign extends BaseEntity {
    name: string;

    signupsOpen: boolean = false;

    dungeonMaster: User;

    maxPlayers: number = 4;

    banner?: string;

    outline?: string;

    getCharacters(): Character[] {
        return [];
    };

    constructor(name: string, dungeonMaster: User) {
        super();
        this.name = name;
        this.dungeonMaster = dungeonMaster;
    }
}