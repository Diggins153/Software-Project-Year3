import { BaseEntity } from "@/entities/BaseEntity";

export class Class extends BaseEntity {
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }
}
