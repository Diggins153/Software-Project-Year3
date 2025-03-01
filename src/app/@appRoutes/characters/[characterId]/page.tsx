import ClassToken from "@/components/characters/ClassToken";
import { Character } from "@/entities/Character";
import getORM from "@/lib/orm";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function CharacterPage({ params }: { params: Promise<{ characterId: number; }> }) {
    const characterId = (await params).characterId;
    const em = await getORM();
    const character = await em.findOne(Character, { id: characterId }, { populate: [ "classes" ] });

    if (character == null) {
        redirect("/characters");
    }

    const { id, owner, image = "", name, race, classes } = character;

    return <main className="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 mx-auto pt-4">
        {/*Character Card*/ }
        <div className="bg-yellow-200 text-black flex flex-col items-center justify-center mt-[calc(75px/2)] rounded-lg pb-2">
            <div className="relative top-[calc(-75px/2)] mb-[calc(-75px/2)]">
                <Image src={ image } alt="" width={ 75 } height={ 75 } className="rounded-full bg-white"/>
            </div>
            <div className="flex justify-between w-full mx-auto px-2 py-1 self-start mt-[calc(-75px/2)]">
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
                <div className="flex w-full flex-wrap justify-center gap-y-2">
                    { classes.map(characterClass => {
                        // @ts-ignore
                        const className = characterClass.class.name;

                        return <div key={ className } className="basis-1/2">
                            <ClassToken characterClass={ characterClass }/>
                        </div>;
                    }) }
                </div>
            </div>
        </div>
        {/*Posts*/ }
        <div className="text-center mt-4 text-xl">
            Here be posts...
        </div>
    </main>;
}
