import { BaseEntity } from "@/entities/BaseEntity";
import { Entity, Property } from "@mikro-orm/core";

@Entity()
export class Race extends BaseEntity {
    @Property()
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }
}
