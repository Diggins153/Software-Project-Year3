import { BaseEntity } from "@/entities/BaseEntity";
import { Entity, Property } from "@mikro-orm/core";

@Entity()
export class Class extends BaseEntity {
    @Property()
    name!: string;
}
