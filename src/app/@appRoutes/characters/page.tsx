import TopBar from "@/components/TopBar";
import { auth } from "@/lib/auth";
import query from "@/lib/database";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Character } from "@/types/Character";
import { CharacterCard, EmptyCharacterCard } from "@/components/characters/CharacterCard";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Characters",
};

/**
 * Characters page that displays the user's created characters
 * Users can view their characters or create a new on
 *
 * @returns {Promise<JSX.Element>} - The characters page ui
 */
export default async function CharactersPage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/");
    }

    const characters = await query<Character[]>(`
        SELECT c.*,
               cl.name AS class_name
        FROM \`character\` c
                 JOIN class cl ON cl.id = c.class_id
        WHERE c.owner_id = ?
    `, session.user.id);

    return <main>
        <TopBar title="Your Characters"/>
        <div className="space-y-4 p-1.5">
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                <Link href="/characters/create">
                    <CharacterCard
                        character={ {
                            id: "create",
                            name: "Create a new Character",
                            image: "/icons/plus.png",
                        } as any as Character }
                    />
                </Link>
                { characters.length > 0
                    ? characters.map(character =>
                        <Link key={ character.id } href={ `/characters/${ character.id }` }>
                            <CharacterCard
                                character={ character }
                            />
                        </Link>)
                    : <EmptyCharacterCard message={ "Oh no! You don't have any characters" }/> }
            </div>
        </div>
    </main>;
}
