import { BaseEntity } from "@/entities/BaseEntity";
import { Character } from "@/entities/Character";
import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";

@Entity()
export class Class extends BaseEntity {
    @Property()
    name!: string;

    @ManyToMany({ entity: () => Character, mappedBy: c => c.classes })
    characters = new Collection<Character>(this);
}
