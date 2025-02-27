"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

type PremadeCharacter = {
    id: string;
    name: string;
    race: string;
    class: string;
    description: string;
    image: string;
};

// Manually defined premade characters
const premadeCharacters: PremadeCharacter[] = [
    {
        id: "goliath-barbarian",
        name: "Grog the Mighty",
        race: "Goliath",
        class: "Barbarian",
        description: "Loves smashing things. Not so great at math. Has won many battles and lost many arguments.",
        image: "/images/grog.jpg",
    },
    {
        id: "elf-rogue",
        name: "Elara the Swift",
        race: "Elf",
        class: "Rogue",
        description: "Steals hearts... and your gold pouch. Will definitely flirt with the enemy mid-fight.",
        image: "/images/elara.jpg",
    },
    {
        id: "human-wizard",
        name: "Zymar the Arcane",
        race: "Human",
        class: "Wizard",
        description: "Magic runs through their veins... sometimes too much. Once accidentally polymorphed into a duck.",
        image: "/images/zymar.jpg",
    },
    {
        id: "half-orc-paladin",
        name: "Seraphina Lightbringer",
        race: "Half-Orc",
        class: "Paladin",
        description: "Holy warrior, radiant smile, terrifying smites. Will heal you, then guilt-trip you for needing healing.",
        image: "/images/seraphina.jpg",
    }
];

export default function PremadeCharactersPage() {
    const { data: session } = useSession(); // Get user session
    const [selectedCharacter, setSelectedCharacter] = useState<PremadeCharacter | null>(null);
    const [characterName, setCharacterName] = useState("");
    const [loading, setLoading] = useState(false);

    // Handles when a user clicks a card
    const handleSelectCharacter = (character: PremadeCharacter) => {
        setSelectedCharacter(character);
        setCharacterName("");
    };

    // Handles character creation
    const handleConfirmSelection = async () => {
        if (!selectedCharacter || !characterName) return;
        if (!session?.user?.email) {
            alert("You must be logged in to create a character.");
            return;
        }

        setLoading(true);

        const response = await fetch("/api/create-character", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: characterName,
                raceName: selectedCharacter.race,
                className: selectedCharacter.class,
                userEmail: session.user.email,
            }),
        });

        setLoading(false);

        if (response.ok) {
            alert(`${characterName} the ${selectedCharacter.race} ${selectedCharacter.class} has been created!`);
            setSelectedCharacter(null);
        } else {
            alert("Failed to create character.");
        }
    };

    return (
        <main className="p-6 grid grid-cols-4 gap-6">
            {premadeCharacters.map((character) => (
                <div key={character.id} className="w-[300px] h-[500px] bg-gray-100 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer"
                     onClick={() => handleSelectCharacter(character)}
                >
                    {/* Character Image (Top 300px) */}
                    <div className="h-[300px] relative">
                        <Image src={character.image} alt={character.name} layout="fill" objectFit="cover"/>
                    </div>

                    {/* Character Info (Bottom 200px) */}
                    <div className="h-[200px] p-4 flex flex-col justify-center text-center">
                        <h2 className="text-xl font-bold">{character.name}</h2>
                        <p className="text-md text-gray-700 mt-1">
                            {character.race} {character.class}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            {character.description}
                        </p>
                    </div>

                    {/* Character Naming Prompt */}
                    {selectedCharacter?.id === character.id && (
                        <div className="p-4 mt-2 bg-white rounded-lg shadow-md flex flex-col items-center">
                            <input
                                type="text"
                                value={characterName}
                                onChange={(e) => setCharacterName(e.target.value)}
                                placeholder="Enter character name"
                                className="border rounded-lg px-3 py-2 w-full"
                            />
                            <button
                                onClick={handleConfirmSelection}
                                disabled={loading}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {loading ? "Creating..." : "Confirm"}
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </main>
    );
}
