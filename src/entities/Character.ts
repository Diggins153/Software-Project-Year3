import { BaseEntity } from "@/entities/BaseEntity";
import { Class } from "@/entities/Class";
import { Race } from "@/entities/Race";
import { Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";

@Entity()
export class Character extends BaseEntity {
    @Property()
    name!: string;

    @Property()
    handle!: string;

    @ManyToOne()
    race!: Race;

    @Property()
    image!: string;

    @ManyToMany()
    levels: Class[] = [];
}
