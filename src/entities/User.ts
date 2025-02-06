import { BaseEntity } from "@/entities/BaseEntity";
import { Character } from "@/entities/Character";
import { Entity, ManyToMany, OneToMany, Property, Unique } from "@mikro-orm/core";

@Entity()
export class User extends BaseEntity {
    @Property()
    displayName!: string;

    @Property()
    @Unique()
    email!: string;

    @Property()
    password!: string;

    @Property({ length: 5 })
    role: "USER" | "ADMIN" = "USER";

    @Property()
    isPaying: boolean = false;

    @Property()
    lastConsentDate: Date = new Date(0);
}
