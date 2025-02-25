import { BaseEntity } from "@/entities/BaseEntity";
import { Character } from "@/entities/Character";
import { Cascade, Collection, Entity, Enum, OneToMany, Property, Unique } from "@mikro-orm/core";

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
    lastConsentDate: Date;

    @OneToMany(() => Character, character => character.owner, { cascade: [ Cascade.SCHEDULE_ORPHAN_REMOVAL ] })
    characters = new Collection<Character>(this);

    constructor(displayName: string, email: string, password: string, lastConsentDate: Date) {
        super();
        this.displayName = displayName;
        this.email = email;
        this.password = password;
        this.lastConsentDate = lastConsentDate;
    }
}
