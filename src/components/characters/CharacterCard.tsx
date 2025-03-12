import ClassTokens from "@/components/characters/ClassTokens";
import query from "@/lib/database";
import { Character } from "@/types/Character";
import { CharacterClass } from "@/types/CharacterClass";
import Image from "next/image";

export default async function CharacterCard({ character }: { character?: Character }) {
    if (!!character) {
        const { id, image = "", name } = character;
        const classes = await query<CharacterClass[]>("SELECT character_class.*, c.name AS class_name FROM character_class JOIN class c ON c.id = character_class.class_id WHERE character_id = ?", id);

        return <div
            className="bg-yellow-200 text-black flex flex-col items-center justify-center mt-[calc(75px/2)] rounded-lg border-2 border-transparent w-full"
        >
            <div className="relative top-[calc(-75px/2)] mb-[calc(-75px/2)]">
                { image
                    ? <Image src={ image } alt="" width={ 75 } height={ 75 } className="rounded-full bg-white"/>
                    : <div className="h-[75px] w-[75px] bg-white rounded-full"></div>
                }
                <div className="absolute left-full top-full -translate-y-full -translate-x-[25px]">
                    <ClassTokens classes={ classes }/>
                </div>
            </div>
            <div className="text-lg p-1 select-none text-center">
                { name }
            </div>
        </div>;
    } else {
        return <div
            className="bg-yellow-200 text-black flex flex-col items-center justify-center mt-[calc(75px/2)] rounded-lg"
        >
            <p className="text-lg p-1 select-none text-center">
                Oh no! <br/>
                You don't have any characters
            </p>
        </div>;
    }
};