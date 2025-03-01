import ClassToken from "@/components/characters/ClassToken";
import { Character } from "@/entities/Character";
import getORM from "@/lib/orm";
import { wrap } from "@mikro-orm/core";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function CharacterPage({ params }: { params: Promise<{ characterId: number; }> }) {
    const characterId = (await params).characterId;
    const em = await getORM();
    const character = await em.findOne(Character, { id: characterId }, { populate: [ "classes" ] });

    if (character == null) {
        redirect("/characters");
    }

    const { id, owner, image = "", name, race, classes } = wrap(character).toPOJO();
    // @ts-ignore
    const characterClasses: string[] = classes.map(c => c.name);

    return <main className="">
        {/*Character Card*/ }
        <div className="bg-yellow-200 text-black flex flex-col items-center justify-center mt-[calc(75px/2)] rounded-lg pb-2">
            <div className="relative top-[calc(-75px/2)] mb-[calc(-75px/2)]">
                <Image src={ image } alt="" width={ 75 } height={ 75 } className="rounded-full bg-white"/>
            </div>
            <div className="flex justify-between w-full mx-auto md:w-3/4 px-2 py-1 select-none self-start mt-[calc(-75px/2)]">
                <div className="text-xl grow basis-0">
                    { name }
                </div>
                <div className="w-[75px] mx-3"></div>
                <div className="text-right grow basis-0">
                    { /*@ts-ignore*/ }
                    { race.name }
                </div>
            </div>
            <div className="flex flex-col mt-2.5 gap-2.5">
                <div>
                    { characterClasses.map(className => <ClassToken key={ className } className={ className }/>) }
                </div>
            </div>
        </div>
        {JSON.stringify(classes)}
    </main>;
}
