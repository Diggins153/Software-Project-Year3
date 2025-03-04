import { Character } from "@/entities/Character";
import { Class } from "@/entities/Class";

export class CharacterClass {
    character: Character;

    class: Class;

    level: number;

    constructor(character: Character, characterClass: Class, level: number) {
        this.character = character;
        this.class = characterClass;
        this.level = level;
    }
}