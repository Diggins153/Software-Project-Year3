"use client";

import TopBar from "@/components/TopBar";
import { createPremadeCharacter } from "@/lib/actions/characters";
import { PremadeCharacter } from "@/types/PremadeCharacter";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import "../cards.css"

/**
 * Component for displaying and selecting premade characters
 * @returns {JSX.Element} - The premade characters selection UI
 */
export default function PremadeCharactersPage() {
    const [ loading, setLoading ] = useState(true);
    const [ premadeCharacters, setPremadeCharacters ] = useState<PremadeCharacter[]>([]);

    useEffect(() => {
        async function fetchCharacters() {
            const res = await fetch("/api/premade", { cache: "force-cache" });
            if (res.ok)
                setPremadeCharacters(await res.json());
        }

        fetchCharacters();
    }, []);

    useEffect(() => {
        if (premadeCharacters.length === 0) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [ premadeCharacters ]);

    if (loading) return <main className="flex items-center justify-center gap-4 min-h-screen">
        <Loader2 className="animate-spin ease-in-out" size={ 48 }/>
        <h3 className="text-xl">Loading Characters</h3>
    </main>;

    return (
        <main>
            <TopBar title="Choose from Premade Characters" backText="Characters" backLink="/characters"/>
            <div className="p-6 grid grid-cols-4 gap-2 ml-36">
                { premadeCharacters.map((character) => (
                    <div
                        key={ character.id }
                        className="relative w-[300px] h-[500px] group"
                        style={ { perspective: "1000px" } }
                        onClick={ async () =>
                            await createPremadeCharacter(character.name, character.race_id, character.class_id, 3)
                        }
                    >
                        <div
                            className={ `flip-card-inner w-full h-full bg-yellow-200 rounded-lg shadow-lg cursor-pointer transition-transform duration-700 border border-gray-200` }
                        >
                            {/* Front Side */ }
                            <div className="flip-card-front absolute w-full h-full flex flex-col">
                                {/* Title at the Top */ }
                                <div className="p-4 text-center">
                                    <h2 className="text-xl font-bold text-gray-700">
                                        { character.name }
                                    </h2>
                                </div>
                                {/* Image Section */ }
                                <div className="h-[300px] relative">
                                    {/* Uncomment and update Image component if needed */ }
                                    {/* <Image src={character.image} alt={character.name} layout="fill" objectFit="cover" /> */ }
                                </div>
                                {/* Description at the Bottom */ }
                                <div className="mt-auto p-4 text-center">
                                    <p className="text-md text-gray-700">
                                        { character.race_name } { character.class_name } (Lvl 3)
                                    </p>
                                    <p className="text-sm text-gray-700 mt-2">
                                        { character.description }
                                    </p>
                                </div>
                            </div>
                            {/* Back Side */ }
                            <div className="flip-card-back absolute w-full h-full flex items-center justify-center bg-yellow-200 rounded-lg shadow-lg text-center p-4">
                                <p className="text-xl font-bold text-gray-700">
                                    Select { character.name }?
                                </p>
                            </div>
                        </div>
                    </div>
                )) }
            </div>
        </main>
    );
}
