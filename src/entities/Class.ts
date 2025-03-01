import { BaseEntity } from "@/entities/BaseEntity";
import { CharacterClass } from "@/entities/CharacterClass";
import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";

@Entity()
export class Class extends BaseEntity {
    @Property()
    name!: string;

    @OneToMany({ entity: () => CharacterClass, mappedBy: c => c.class })
    characters = new Collection<CharacterClass>(this);
}
