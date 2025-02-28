import { BaseEntity } from "@/entities/BaseEntity";
import { CharacterClasses } from "@/entities/CharacterClasses";
import { Class } from "@/entities/Class";
import { Race } from "@/entities/Race";
import { User } from "@/entities/User";
import { Collection, Entity, ManyToMany, ManyToOne, Property, type Ref } from "@mikro-orm/core";

@Entity()
export class Character extends BaseEntity {
    @Property()
    name: string;

    @Property()
    handle: string;

    @ManyToOne(() => Race, { eager: true })
    race: Ref<Race>;

    @Property()
    image?: string;

    @ManyToMany({ entity: () => Class, pivotEntity: () => CharacterClasses })
    classes = new Collection<CharacterClasses>(this);

    @ManyToOne(() => User)
    owner!: Ref<User>;

    constructor(name: string, handle: string, race: Ref<Race>) {
        super();
        this.name = name;
        this.handle = handle;
        this.race = race;
    }
}
