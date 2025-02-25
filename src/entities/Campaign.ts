import { BaseEntity } from "@/entities/BaseEntity";
import { User } from "@/entities/User";
import { Entity, ManyToOne, Property, ref, type Ref } from "@mikro-orm/core";

@Entity()
export class Campaign extends BaseEntity {
    @Property({ length: 50 })
    name: string;

    @Property()
    signupsOpen: boolean = false;

    @ManyToOne(() => User)
    dungeonMaster: Ref<User>;

    @Property({ type: "int", default: 4 })
    maxPlayers: number = 4;

    @Property()
    banner?: string;

    @Property({ type: "text" })
    outline?: string;

    constructor(name: string, dungeonMaster: User) {
        super();
        this.name = name;
        this.dungeonMaster = ref(dungeonMaster);
    }
}