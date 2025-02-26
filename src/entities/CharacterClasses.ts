import { Character } from "@/entities/Character";
import { Class } from "@/entities/Class";
import { Entity, ManyToOne, Property, type Ref } from "@mikro-orm/core";

@Entity()
export class CharacterClasses {
    @ManyToOne({ entity: () => Character, primary: true })
    character: Ref<Character>;

    @ManyToOne({ entity: () => Class, primary: true })
    class: Ref<Class>;

    @Property({ type: "int", default: "1" })
    level!: number;

    constructor(character: Ref<Character>, characterClass: Ref<Class>, level: number) {
        this.character = character;
        this.class = characterClass;
        this.level = level;
    }
}