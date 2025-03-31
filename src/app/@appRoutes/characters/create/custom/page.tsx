"use client";

import { useState } from "react";
import { createCharacter } from "@/lib/actions/characters";

const classes = [
    { name: "Barbarian", description: "A fierce warrior who can enter a battle rage." },
    { name: "Bard", description: "An inspiring magician whose power echoes the music of creation." },
    { name: "Cleric", description: "A priestly champion who wields divine magic in service of a higher power." },
    { name: "Druid", description: "A priest of the Old Faith, wielding the powers of nature and adopting animal forms." },
    { name: "Fighter", description: "A master of martial combat, skilled with a variety of weapons and armor." },
    { name: "Monk", description: "A master of martial arts, harnessing the power of the body and mind." },
    { name: "Paladin", description: "A holy warrior bound to a sacred oath." },
    { name: "Ranger", description: "A warrior who uses martial prowess and nature magic to combat threats." },
    { name: "Rogue", description: "A scoundrel who uses stealth and trickery to overcome obstacles and enemies." },
    { name: "Sorcerer", description: "A spellcaster who draws on inherent magic from a gift or bloodline." },
    { name: "Warlock", description: "A wielder of magic derived from a bargain with an extraplanar entity." },
    { name: "Wizard", description: "A scholarly magic-user capable of manipulating the structures of reality." }
];

const races = [
    { name: "Human", description: "Versatile and ambitious, humans are found in every corner of the world." },
    { name: "Elf", description: "Graceful, keen, and long-lived, elves possess a natural affinity for magic." },
    { name: "Dwarf", description: "Sturdy and resilient, dwarves are known for their craftsmanship and combat prowess." },
    { name: "Halfling", description: "Small and nimble, halflings are resourceful and cheerful." },
    { name: "Gnome", description: "Inventive and quirky, gnomes have an innate knack for magic and engineering." },
    { name: "Half-Elf", description: "Blending human versatility with elven grace, half-elves are charismatic and adaptable." },
    { name: "Half-Orc", description: "Strong and tough, half-orcs combine human determination with orcish might." },
    { name: "Tiefling", description: "Descendants of infernal heritage, tieflings possess a mysterious and charismatic nature." },
    { name: "Dragonborn", description: "Born of draconic lineage, dragonborn combine honor with elemental power." },
    { name: "Aarakocra", description: "Avian humanoids that soar through the skies with grace and agility." },
    { name: "Genasi", description: "Born of the elemental planes, Genasi carry the essence of air, earth, fire, or water." },
    { name: "Goliath", description: "Towering and strong, goliaths are a hardy people of the mountains." }
];
/**
 * Character creation component with a step-by-step selection process
 * @returns {JSX.Element} - The character creation UI
 */
export default function CreateCharacter() {
    // currentPage 0: Race Selection; 1: Class Selection; 2: Review & Confirm
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 3;
    const pageTitles = ["Race Selection", "Class Selection", "Review & Confirm"];

    const [selectedRace, setSelectedRace] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [characterName, setCharacterName] = useState("");
    const [level, setLevel] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    /**
     * Navigates to the next page if possible
     */
    const goNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goBack = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };
    /**
     * Handles character confirmation and submission
     */
    const handleConfirm = async () => {
        if (!selectedRace || !selectedClass || !characterName.trim()) return;
        setIsSaving(true);
        try {
            await createCharacter(characterName, selectedRace, selectedClass, level);
        } catch (error) {
            console.error("Error creating character:", error);
            setIsSaving(false);
        }
    };


    return (
        <main className="relative p-8 min-h-screen">
            {/* Pagination Navigation with Arrow Buttons, Labels, and Hover Effects */}
            <div className="absolute top-4 left-4 flex items-center group">
                {currentPage > 0 && (
                    <>
                        <button onClick={goBack} className="text-3xl mr-2 transition-all duration-300 group-hover:scale-125">
                            &larr;
                        </button>
                        <span className="text-lg font-medium transition-all duration-300 opacity-0 group-hover:opacity-100">
              Previous: {pageTitles[currentPage - 1]}
            </span>
                    </>
                )}
            </div>
            <div className="absolute top-4 right-4 flex items-center group">
                {currentPage < totalPages - 1 && (
                    <>
            <span className="text-lg font-medium mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100">
              Next: {pageTitles[currentPage + 1]}
            </span>
                        <button onClick={goNext} className="text-3xl transition-all duration-300 group-hover:scale-125">
                            &rarr;
                        </button>
                    </>
                )}
            </div>

            <h1 className="text-4xl font-bold text-center">Create Your Character</h1>
            <p className="text-gray-600 text-center mt-2">Follow the steps below.</p>

            {/* Page 0: Race Selection */}
            {currentPage === 0 && (
                <section className="mt-8">
                    <h2 className="text-2xl font-bold text-center mb-4">Choose Your Race</h2>
                    <div className="grid grid-cols-4 gap-2 ml-36">
                        {races.map((race) => (
                            <div
                                key={race.name}
                                className="relative w-[300px] h-[500px] group"
                                style={{ perspective: "1000px" }}
                                onClick={() => setSelectedRace(race.name)}
                            >
                                <div
                                    className={`flip-card-inner w-full h-full bg-yellow-200 rounded-lg shadow-lg cursor-pointer transition-transform duration-700 ${
                                        selectedRace === race.name ? "border-4 border-blue-500" : "border border-gray-200"
                                    }`}
                                >
                                    <div className="flip-card-front absolute w-full h-full flex flex-col">
                                        <div className="p-4 text-center">
                                            <h2 className="text-xl font-bold text-gray-700">{race.name}</h2>
                                        </div>
                                        <div className="mt-auto text-center">
                                            <p className="text-gray-700">{race.description}</p>
                                        </div>
                                    </div>
                                    <div className="flip-card-back absolute w-full h-full flex items-center justify-center">
                                        <p className="text-xl font-bold text-gray-700">Select {race.name}?</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Page 1: Class Selection */}
            {currentPage === 1 && (
                <section className="mt-8">
                    <h2 className="text-2xl font-bold text-center mb-4">Choose Your Class</h2>
                    <div className="grid grid-cols-4 gap-2 ml-36">
                        {classes.map((cls) => (
                            <div
                                key={cls.name}
                                className="relative w-[300px] h-[500px] group"
                                style={{ perspective: "1000px" }}
                                onClick={() => setSelectedClass(cls.name)}
                            >
                                <div
                                    className={`flip-card-inner w-full h-full bg-yellow-200 rounded-lg shadow-lg cursor-pointer transition-transform duration-700 ${
                                        selectedClass === cls.name ? "border-4 border-blue-500" : "border border-gray-200"
                                    }`}
                                >
                                    <div className="flip-card-front absolute w-full h-full flex flex-col">
                                        <div className="p-4 text-center">
                                            <h2 className="text-xl font-bold text-gray-700">{cls.name}</h2>
                                        </div>
                                        <div className="mt-auto text-center">
                                            <p className="text-gray-700">{cls.description}</p>
                                        </div>
                                    </div>
                                    <div className="flip-card-back absolute w-full h-full flex items-center justify-center">
                                        <p className="text-xl font-bold text-gray-700">Select {cls.name}?</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Page 2: Review & Confirm */}
            {currentPage === 2 && (
                <section className="mt-8 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-center mb-4">Review and Confirm</h2>
                    <div className="w-80 p-6 shadow-lg rounded-lg border border-gray-300 text-center">
                        <p className="text-lg">
                            {selectedRace || "?"} {selectedClass || "?"}
                        </p>
                        <input
                            type="text"
                            value={characterName}
                            onChange={(e) => setCharacterName(e.target.value)}
                            placeholder="Enter character name"
                            className="border rounded-lg px-3 py-2 w-full mt-4 text-center"
                        />
                        <h3 className="text-lg font-semibold mt-4">Level: {level}</h3>
                        <input
                            type="range"
                            min="1"
                            max="20"
                            value={level}
                            onChange={(e) => setLevel(parseInt(e.target.value))}
                            className="w-full mt-2"
                        />
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedRace || !selectedClass || !characterName.trim() || isSaving}
                            className={`mt-6 px-6 py-3 rounded-lg text-white font-bold transition-all ${
                                selectedRace && selectedClass && characterName.trim()
                                    ? "bg-green-500 hover:bg-green-700"
                                    : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {isSaving ? "Saving..." : "Confirm Character"}
                        </button>
                    </div>
                </section>
            )}

            <style jsx>{`
        .flip-card-inner {
          transform-style: preserve-3d;
        }
        .flip-card-front,
        .flip-card-back {
          backface-visibility: hidden;
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
