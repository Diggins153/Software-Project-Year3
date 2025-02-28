import CharacterCard from "@/components/characters/CharacterCard";
import { Character } from "@/entities/Character";
import { auth } from "@/lib/auth";
import getORM from "@/lib/orm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CharactersPage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/");
    }

    const em = await getORM();
    const characters = await em.find(
        Character,
        { owner: { email: session.user.email } },
        { disableIdentityMap: true, populate: [ "*" ] },
    );

    return (
        <main>
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-center">Your Characters</h1>
                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    <CharacterCard
                        character={ {
                            id: "create",
                            name: "Create a new Character",
                            image: "/icons/plus.png",
                        } as any as Character }
                    />
                    { characters.length > 0
                        ? characters.map(character => <CharacterCard
                            key={ character.id }
                            character={ character }
                        />)
                        : <CharacterCard/> }
                </div>
            </div>

            <div className="p-6 flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold text-center">Create Your Character</h1>

                <div className="flex gap-6">
                    {/* Premade Character Card */ }
                    <Link href="/characters/pre-made">
                        <div className="w-[300px] h-[750px] p-6 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-2xl hover:scale-105 hover:border-gray-400 active:scale-95 cursor-pointer flex flex-col justify-center">
                            <h2 className="text-xl font-bold text-gray-800">Choose a Premade Character</h2>
                            <p className="text-gray-600 mt-2">
                                Browse a selection of pre-built characters, ready for adventure.
                                Perfect for those who want to jump into the game quickly!
                            </p>
                        </div>
                    </Link>

                    {/* Custom Character Card */ }
                    <Link href="/characters/create">
                        <div className="w-[300px] h-[750px] p-6 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-2xl hover:scale-105 hover:border-gray-400 active:scale-95 cursor-pointer flex flex-col justify-center">
                            <h2 className="text-xl font-bold text-gray-800">Make It Your Way</h2>
                            <p className="text-gray-600 mt-2">
                                Design your own character from scratch with complete creative freedom.
                                Choose your race, class, abilities, and more!
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    );
}
