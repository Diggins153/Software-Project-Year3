"use client";

import { createPremadeCharacter } from "@/lib/actions/characters";
import Image from "next/image";

type PremadeCharacter = {
    id: string;
    name: string;
    race: string;
    class: string;
    description: string;
    level: number;
    // image: string;
};

// Manually defined premade characters
const premadeCharacters: PremadeCharacter[] = [
    {
        id: "goliath-barbarian",
        name: "Grog the Mighty",
        race: "Goliath",
        class: "Barbarian",
        description:
            "Loves smashing things. Not so great at math. Has won many battles and lost many arguments.",
        level: 3,
        // image: "/images/grog.jpg",
    },
    {
        id: "elf-rogue",
        name: "Elara the Swift",
        race: "Elf",
        class: "Rogue",
        description:
            "Steals hearts... and your gold pouch. Will definitely flirt with the enemy mid-fight.",
        level: 3,
        // image: "/images/elara.jpg",
    },
    {
        id: "human-wizard",
        name: "Zymar the Arcane",
        race: "Human",
        class: "Wizard",
        description:
            "Magic runs through their veins... sometimes too much. Once accidentally polymorphed into a duck.",
        level: 3,
        // image: "/images/zymar.jpg",
    },
    {
        id: "half-orc-paladin",
        name: "Seraphina Lightbringer",
        race: "Half-Orc",
        class: "Paladin",
        description:
            "Holy warrior, radiant smile, terrifying smites. Will heal you, then guilt-trip you for needing healing.",
        level: 3,
        // image: "/images/seraphina.jpg",
    },
    {
        id: "dwarf-fighter",
        name: "Brom Ironfist",
        race: "Dwarf",
        class: "Fighter",
        description:
            "Stubborn, tough, and swings an axe like it's an extension of his beard. Loves ale and battle equally.",
        level: 3,
        // image: "/images/brom.jpg",
    },
    {
        id: "tiefling-warlock",
        name: "Nyx the Shadow",
        race: "Tiefling",
        class: "Warlock",
        description:
            "Pacts with dark forces? Check. Shadowy past? Check. Really good at dramatic pauses? Absolutely.",
        level: 3,
        // image: "/images/nyx.jpg",
    },
    {
        id: "halfling-bard",
        name: "Finn Songfoot",
        race: "Halfling",
        class: "Bard",
        description:
            "Plays the lute, charms the crowd, and probably knows more gossip than a noble’s servant.",
        level: 3,
        // image: "/images/finn.jpg",
    },
    {
        id: "dragonborn-sorcerer",
        name: "Ignis Stormborn",
        race: "Dragonborn",
        class: "Sorcerer",
        description:
            "Born with power, breathes magic, and occasionally sets things on fire... on purpose.",
        level: 3,
        // image: "/images/ignis.jpg",
    },
    {
        id: "gnome-druid",
        name: "Willow Thistlebloom",
        race: "Gnome",
        class: "Druid",
        description:
            "Can turn into a bear, but prefers to chat with squirrels. Deeply concerned about deforestation.",
        level: 3,
        // image: "/images/willow.jpg",
    },
    {
        id: "half-elf-ranger",
        name: "Kaelen Shadowstep",
        race: "Half-Elf",
        class: "Ranger",
        description:
            "Silent, deadly, and has a wolf companion that’s more social than he is.",
        level: 3,
        // image: "/images/kaelen.jpg",
    },
    {
        id: "orc-monk",
        name: "Torug the Serene",
        race: "Orc",
        class: "Monk",
        description:
            "Once punched a tree so hard it apologized. Finds inner peace through disciplined fury.",
        level: 3,
        // image: "/images/torug.jpg",
    },
    {
        id: "goblin-artificer",
        name: "Zibzok the Tinkerer",
        race: "Goblin",
        class: "Artificer",
        description:
            "Builds crazy gadgets, some of which explode. Claims that’s ‘just a feature.’",
        level: 3,
        // image: "/images/zibzok.jpg",
    }
];

/**
 * Component for displaying and selecting premade characters
 * @returns {JSX.Element} - The premade characters selection UI
 */
export default function PremadeCharactersPage() {
    return (
        <main className="p-6 grid grid-cols-4 gap-2 ml-36">
            {premadeCharacters.map((character) => (
                <div
                    key={character.id}
                    className="relative w-[300px] h-[500px] group"
                    style={{ perspective: "1000px" }}
                    onClick={async () =>
                        await createPremadeCharacter(
                            character.name,
                            character.race,
                            character.class,
                            character.level
                        )
                    }
                >
                    <div
                        className={`flip-card-inner w-full h-full bg-yellow-200 rounded-lg shadow-lg cursor-pointer transition-transform duration-700 border border-gray-200`}
                    >
                        {/* Front Side */}
                        <div className="flip-card-front absolute w-full h-full flex flex-col">
                            {/* Title at the Top */}
                            <div className="p-4 text-center">
                                <h2 className="text-xl font-bold text-gray-700">
                                    {character.name}
                                </h2>
                            </div>
                            {/* Image Section */}
                            <div className="h-[300px] relative">
                                {/* Uncomment and update Image component if needed */}
                                {/* <Image src={character.image} alt={character.name} layout="fill" objectFit="cover" /> */}
                            </div>
                            {/* Description at the Bottom */}
                            <div className="mt-auto p-4 text-center">
                                <p className="text-md text-gray-700">
                                    {character.race} {character.class} (Lvl {character.level})
                                </p>
                                <p className="text-sm text-gray-700 mt-2">
                                    {character.description}
                                </p>
                            </div>
                        </div>
                        {/* Back Side */}
                        <div className="flip-card-back absolute w-full h-full flex items-center justify-center bg-yellow-200 rounded-lg shadow-lg">
                            <p className="text-xl font-bold text-gray-700">
                                Select {character.name}?
                            </p>
                        </div>
                    </div>
                </div>
            ))}
            <style jsx>{`
                .flip-card-inner {
                    transform-style: preserve-3d;
                }
                .flip-card-front,
                .flip-card-back {
                    backface-visibility: hidden;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }
                .flip-card-back {
                    transform: rotateY(180deg);
                }
                .group:hover .flip-card-inner {
                    transform: rotateY(180deg);
                }
            `}</style>
        </main>
    );
}
