import { BaseEntity } from "@/entities/BaseEntity";

export class Race extends BaseEntity {
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }
}
