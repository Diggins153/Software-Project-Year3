import { BaseEntity } from "@/entities/BaseEntity";
import { Class } from "@/entities/Class";
import { Race } from "@/entities/Race";
import { User } from "@/entities/User";
import { Entity, ManyToMany, ManyToOne, Property, type Ref } from "@mikro-orm/core";

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

    @ManyToOne()
    owner!: Ref<User>;
}
