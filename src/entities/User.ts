import { BaseEntity } from "@/entities/BaseEntity";
import { Campaign } from "@/entities/Campaign";
import { Character } from "@/entities/Character";
import { Cascade, Collection, Entity, Enum, OneToMany, Property, Unique } from "@mikro-orm/core";

@Entity()
export class User extends BaseEntity {
    @Property()
    displayName: string;

    @Property()
    @Unique()
    email: string;

    @Property()
    password: string;

    @Enum(() => UserRole)
    role: UserRole = UserRole.USER;

    @Property()
    isPaying: boolean = false;

    @Property()
    lastConsentDate: Date;

    @OneToMany(() => Character, character => character.owner)
    characters = new Collection<Character>(this);

    // Note: The entity needs to be specified as string else build fails
    @OneToMany("Campaign", "dungeonMaster", { orphanRemoval: true })
    campaigns = new Collection<Campaign>(this);

    constructor(displayName: string, email: string, password: string, lastConsentDate: Date) {
        super();
        this.displayName = displayName;
        this.email = email;
        this.password = password;
        this.lastConsentDate = lastConsentDate;
    }
}

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}
