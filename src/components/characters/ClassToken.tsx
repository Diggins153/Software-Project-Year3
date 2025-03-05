import { CharacterClass } from "@/types/CharacterClass";
import Image from "next/image";

export default function ClassToken({ characterClass }: { characterClass: CharacterClass }) {
    const level = characterClass.level;
    const className: string = characterClass.class_name || "";

    return <div className="flex gap-1 items-center justify-center">
        <div className="bg-white border-2 rounded-full p-1">
            <Image
                className="aspect-square"
                src={ `/classes/${ className }.svg` }
                alt={ `${ className } class` }
                width={ 25 }
                height={ 25 }
            />
        </div>
        <span className="text-lg">Lvl. {level} { className }</span>
    </div>;
}