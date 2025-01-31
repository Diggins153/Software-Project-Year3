import { BaseEntity } from "@/entities/BaseEntity";
import { User } from "@/entities/User";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";

@Entity()
export class VerificationCode extends BaseEntity {
    @ManyToOne()
    user!: User;

    @Property()
    code!: string;

    @Property()
    expirationDate!: Date;
}
