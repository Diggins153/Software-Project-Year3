import { BaseEntity } from "@/entities/BaseEntity";
import { CharacterClasses } from "@/entities/CharacterClasses";
import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";

@Entity()
export class Class extends BaseEntity {
    @Property()
    name!: string;

    @OneToMany({ entity: () => CharacterClasses, mappedBy: c => c.class })
    characters = new Collection<CharacterClasses>(this);
}
