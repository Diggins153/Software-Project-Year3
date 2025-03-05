import { auth } from "@/lib/auth";
import query from "@/lib/database";
import { redirect } from "next/navigation";
import { Character } from "@/types/Character";
import CharacterCard from "@/components/characters/CharacterCard";

export default async function CharactersPage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/");
    }

    const characters = await query<Character[]>("SELECT * FROM `character` WHERE owner_id = ?", session.user.id);

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
        </main>
    );
}
