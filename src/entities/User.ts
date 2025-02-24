import { BaseEntity } from "@/entities/BaseEntity";
import { Entity, Property, Unique } from "@mikro-orm/core";

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

    constructor(displayName: string, email: string, password: string, lastConsentDate: Date) {
        super();
        this.displayName = displayName;
        this.email = email;
        this.password = password;
        this.lastConsentDate = lastConsentDate;
    }
}
