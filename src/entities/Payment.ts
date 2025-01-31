import { User } from "@/entities/User";
import { Entity, ManyToMany, Property } from "@mikro-orm/core";

@Entity()
export class Payment {
    @ManyToMany()
    user!: User;

    @Property()
    paid!: Date;

    @Property()
    reason!: string;

    @Property()
    amount!: number;
}
