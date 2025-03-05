import ClassToken from "@/components/characters/ClassToken";
import { Button } from "@/components/ui/button";
import query from "@/lib/database";
import { Character } from "@/types/Character";
import { auth } from "@/lib/auth";
import { CharacterClass } from "@/types/CharacterClass";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function CharacterPage({ params }: { params: Promise<{ characterId: number; }> }) {
    const session = await auth();

    const characterId = (await params).characterId;
    const character = (await query<Character[]>("SELECT *, r.name AS race_name FROM `character` JOIN race r ON r.id = `character`.race_id WHERE `character`.id = ?", characterId))[0] || null;

    if (!session || !session.user || !character) {
        redirect("/characters");
    }

    const { id, owner_id, image = "", name, race_name } = character;
    const currUserIsOwner = owner_id.toString() === session.user.id;

    const classes = (await query<CharacterClass[]>("SELECT character_class.*, c.name AS class_name FROM character_class JOIN class c ON c.id = character_class.class_id WHERE character_class.character_id = ?", characterId));

    return <main className="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 mx-auto pt-4">
        { currUserIsOwner &&
            <div className="flex justify-end mb-[calc(-75px/2)]">
                <Button className="mb-2">Edit</Button>
            </div>
        }

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
                    { race_name }
                </div>
            </div>
            <div className="flex flex-col mt-2.5 gap-2.5">
                <div className="flex w-full flex-wrap justify-center gap-y-2">
                    { classes.map((characterClass) => {
                        return <div key={ characterClass.class_name } className="basis-1/2">
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
