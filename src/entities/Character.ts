import { BaseEntity } from "@/entities/BaseEntity";
import { CharacterClass } from "@/entities/CharacterClass";
import { Race } from "@/entities/Race";
import { User } from "@/entities/User";

export class Character extends BaseEntity {
    name: string;

    handle: string;

    race: Race;

    image?: string;

    getClasses(): CharacterClass[] {
        return [];
    }

    owner!: User;

    constructor(name: string, handle: string, race: Race) {
        super();
        this.name = name;
        this.handle = handle;
        this.race = race;
    }
}
