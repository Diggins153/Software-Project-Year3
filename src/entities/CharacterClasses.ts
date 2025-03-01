import { Character } from "@/entities/Character";
import { Class } from "@/entities/Class";
import { Entity, ManyToOne, Property, ref, type Ref } from "@mikro-orm/core";

@Entity()
export class CharacterClasses {
    @ManyToOne({ entity: () => Character, primary: true, eager: true })
    character: Ref<Character>;

    @ManyToOne({ entity: () => Class, primary: true, eager: true })
    class: Ref<Class>;

    @Property({ type: "int", default: "1" })
    level: number;

    constructor(character: Character, characterClass: Class, level: number) {
        this.character = ref(character);
        this.class = ref(characterClass);
        this.level = level;
    }
}