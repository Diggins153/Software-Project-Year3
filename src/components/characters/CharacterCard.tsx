import ClassTokens from "@/components/characters/ClassTokens";
import query from "@/lib/database";
import { Character } from "@/types/Character";
import { CharacterClass } from "@/types/CharacterClass";
import Image from "next/image";
import Link from "next/link";

export default async function CharacterCard({ character }: { character?: Character }) {
    if (!!character) {
        const { id, image = "", name } = character;
        const classes = await query<CharacterClass[]>("SELECT character_class.*, c.name AS class_name FROM character_class JOIN class c ON c.id = character_class.class_id WHERE character_id = ?", id);

        return <Link
            href={ `/characters/${ id }` }
            className="bg-yellow-200 text-black flex flex-col items-center justify-center mt-[calc(75px/2)] rounded-lg border-2 border-transparent"
        >
            <div className="relative top-[calc(-75px/2)] mb-[calc(-75px/2)]">
                <Image src={ image } alt="" width={ 75 } height={ 75 } className="rounded-full bg-white"/>
                <div className="absolute left-full top-full -translate-y-full -translate-x-[25px]">
                    <ClassTokens classes={ classes }/>
                </div>
            </div>
            <div className="text-lg p-1 select-none text-center">
                { name }
            </div>
        </Link>;
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