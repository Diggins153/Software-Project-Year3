import { BaseEntity } from "@/entities/BaseEntity";
import { Character } from "@/entities/Character";
import { User } from "@/entities/User";
import { Collection, Entity, ManyToMany, ManyToOne, Property, ref, type Ref } from "@mikro-orm/core";

@Entity()
export class Campaign extends BaseEntity {
    @Property({ length: 50 })
    name: string;

    @Property()
    signupsOpen: boolean = false;

    @ManyToOne(() => User)
    dungeonMaster: User;

    @Property({ type: "int", default: 4 })
    maxPlayers: number = 4;

    @Property()
    banner?: string;

    @Property({ type: "text" })
    outline?: string;

    @ManyToMany(() => Character)
    characters = new Collection<Character>(this);

    constructor(name: string, dungeonMaster: User) {
        super();
        this.name = name;
        this.dungeonMaster = dungeonMaster;
    }
}