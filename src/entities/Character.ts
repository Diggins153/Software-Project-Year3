import { BaseEntity } from "@/entities/BaseEntity";
import { CharacterClasses } from "@/entities/CharacterClasses";
import { Race } from "@/entities/Race";
import { User } from "@/entities/User";
import { Collection, Entity, ManyToOne, OneToMany, Property, type Ref, ref } from "@mikro-orm/core";

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

    @OneToMany({ entity: "CharacterClasses", mappedBy: "character" })
    classes = new Collection<CharacterClasses>(this);

    @ManyToOne(() => User)
    owner!: Ref<User>;

    constructor(name: string, handle: string, race: Race) {
        super();
        this.name = name;
        this.handle = handle;
        this.race = ref(race);
    }
}
