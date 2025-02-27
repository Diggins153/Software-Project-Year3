"use client";

import Image from "next/image";

type PremadeCharacter = {
    id: string;
    name: string;
    race: string;
    class: string;
    description: string;
    // image: string;
};

// Manually defined premade characters
const premadeCharacters: PremadeCharacter[] = [
    {
        id: "goliath-barbarian",
        name: "Grog the Mighty",
        race: "Goliath",
        class: "Barbarian",
        description: "Loves smashing things. Not so great at math. Has won many battles and lost many arguments.",
        // image: "/images/grog.jpg",
    },
    {
        id: "elf-rogue",
        name: "Elara the Swift",
        race: "Elf",
        class: "Rogue",
        description: "Steals hearts... and your gold pouch. Will definitely flirt with the enemy mid-fight.",
        // image: "/images/elara.jpg",
    },
    {
        id: "human-wizard",
        name: "Zymar the Arcane",
        race: "Human",
        class: "Wizard",
        description: "Magic runs through their veins... sometimes too much. Once accidentally polymorphed into a duck.",
        // image: "/images/zymar.jpg",
    },
    {
        id: "half-orc-paladin",
        name: "Seraphina Lightbringer",
        race: "Half-Orc",
        class: "Paladin",
        description: "Holy warrior, radiant smile, terrifying smites. Will heal you, then guilt-trip you for needing healing.",
        // image: "/images/seraphina.jpg",
    },
    {
        id: "dwarf-fighter",
        name: "Brom Ironfist",
        race: "Dwarf",
        class: "Fighter",
        description: "Stubborn, tough, and swings an axe like it's an extension of his beard. Loves ale and battle equally.",
        // image: "/images/brom.jpg",
    },
    {
        id: "tiefling-warlock",
        name: "Nyx the Shadow",
        race: "Tiefling",
        class: "Warlock",
        description: "Pacts with dark forces? Check. Shadowy past? Check. Really good at dramatic pauses? Absolutely.",
        // image: "/images/nyx.jpg",
    },
    {
        id: "halfling-bard",
        name: "Finn Songfoot",
        race: "Halfling",
        class: "Bard",
        description: "Plays the lute, charms the crowd, and probably knows more gossip than a noble’s servant.",
        // image: "/images/finn.jpg",
    },
    {
        id: "dragonborn-sorcerer",
        name: "Ignis Stormborn",
        race: "Dragonborn",
        class: "Sorcerer",
        description: "Born with power, breathes magic, and occasionally sets things on fire... on purpose.",
        // image: "/images/ignis.jpg",
    },
    {
        id: "gnome-druid",
        name: "Willow Thistlebloom",
        race: "Gnome",
        class: "Druid",
        description: "Can turn into a bear, but prefers to chat with squirrels. Deeply concerned about deforestation.",
        // image: "/images/willow.jpg",
    },
    {
        id: "half-elf-ranger",
        name: "Kaelen Shadowstep",
        race: "Half-Elf",
        class: "Ranger",
        description: "Silent, deadly, and has a wolf companion that’s more social than he is.",
        // image: "/images/kaelen.jpg",
    },
    {
        id: "orc-monk",
        name: "Torug the Serene",
        race: "Orc",
        class: "Monk",
        description: "Once punched a tree so hard it apologized. Finds inner peace through disciplined fury.",
        // image: "/images/torug.jpg",
    },
    {
        id: "goblin-artificer",
        name: "Zibzok the Tinkerer",
        race: "Goblin",
        class: "Artificer",
        description: "Builds crazy gadgets, some of which explode. Claims that’s ‘just a feature.’",
        // image: "/images/zibzok.jpg",
    }
];

export default function PremadeCharactersPage() {
    return (
        <main className="p-6 grid grid-cols-4 gap-2 ml-36">

        {premadeCharacters.map((character) => (
                <div
                    key={character.id}
                    className="w-[300px] h-[500px] bg-gray-100 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                    {/* Character Image (Top 300px) */}
                    <div className="h-[300px] relative">
                        {/*<Image src={character.image} alt={character.name} layout="fill" objectFit="cover"/>*/}
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
                </div>
            ))}
        </main>
    );
}
