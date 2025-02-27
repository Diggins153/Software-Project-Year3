"use client";

import { useState } from "react";

const classes = [
    { name: "Fighter", description: "Hit things. Get hit. Repeat. A true master of bonking." },
    { name: "Wizard", description: "Knows a million spells. Forgets to prepare Fireball." },
    { name: "Rogue", description: "Stabs, steals, and disappears. Trust issues included." },
    { name: "Cleric", description: "Heals you. Then judges your life choices." },
    { name: "Bard", description: "Charms dragons, seduces bandits, sings terribly." },
    { name: "Paladin", description: "Holy warrior. Smashes evil. Smashes everything." },
    { name: "Druid", description: "Turns into a bear. Sometimes forgets to turn back." },
    { name: "Warlock", description: "Made a deal with something spooky. Regrets it? Maybe." }
];

const races = [
    { name: "Human", description: "Basic, but effective. The vanilla ice cream of races." },
    { name: "Elf", description: "Lives forever. Thinks they're better than you. Probably are." },
    { name: "Dwarf", description: "Beard game strong. Beer game stronger." },
    { name: "Orc", description: "Big. Green. Loud. Punch first, ask questions never." },
    { name: "Gnome", description: "Tiny, chaotic, and probably too smart for their own good." },
    { name: "Tiefling", description: "Horned and edgy. Mysterious past? Check." },
    { name: "Halfling", description: "Short, sneaky, and constantly snacking." },
    { name: "Dragonborn", description: "Half-dragon, breathes fire, still can’t fly." }
];

export default function CreateCharacter() {
    const [selectedCategory, setSelectedCategory] = useState<"classes" | "races" | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedRace, setSelectedRace] = useState<string | null>(null);
    const [characterName, setCharacterName] = useState("");
    const [level, setLevel] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    const handleConfirm = async () => {
        if (!selectedRace || !selectedClass || !characterName.trim()) return;
        setIsSaving(true);

        // Simulating a save request (replace with actual API call if needed)
        setTimeout(() => {
            alert(`Character Created!\nName: ${characterName}\nRace: ${selectedRace}\nClass: ${selectedClass}\nLevel: ${level}`);
            setIsSaving(false);
        }, 1000);
    };

    return (
        <main className="flex flex-col items-center p-8 min-h-screen">
            <h1 className="text-4xl font-bold">Create Your Character</h1>
            <p className="text-gray-600 mt-2">Choose your race and class.</p>

            {/* Selection Options */}
            <div className="flex gap-6 mt-8">
                <button
                    className={`px-6 py-3 rounded-lg text-white font-bold transition-all ${
                        selectedCategory === "classes" ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-400 hover:bg-gray-600"
                    }`}
                    onClick={() => setSelectedCategory(selectedCategory === "classes" ? null : "classes")}
                >
                    {selectedCategory === "classes" ? "Close Classes" : "Choose Class"}
                </button>

                <button
                    className={`px-6 py-3 rounded-lg text-white font-bold transition-all ${
                        selectedCategory === "races" ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-400 hover:bg-gray-600"
                    }`}
                    onClick={() => setSelectedCategory(selectedCategory === "races" ? null : "races")}
                >
                    {selectedCategory === "races" ? "Close Races" : "Choose Race"}
                </button>
            </div>

            {/* Class Selection Grid */}
            {selectedCategory === "classes" && (
                <div className="p-6 grid grid-cols-4 gap-2 ml-36">
                    {classes.map((charClass) => (
                        <div
                            key={charClass.name}
                            className={`w-[300px] h-[500px] bg-gray-100 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer p-4 ${
                                selectedClass === charClass.name ? "border-4 border-blue-500" : "border border-gray-200"
                            }`}
                            onClick={() => setSelectedClass(charClass.name)}
                        >
                            <h2 className="text-xl font-bold text-center">{charClass.name}</h2>
                            <p className="text-gray-700 mt-2 text-center">{charClass.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Race Selection Grid */}
            {selectedCategory === "races" && (
                <div className="p-6 grid grid-cols-4 gap-2 ml-36">
                    {races.map((race) => (
                        <div
                            key={race.name}
                            className={`w-[300px] h-[500px] bg-gray-100 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer p-4 ${
                                selectedRace === race.name ? "border-4 border-blue-500" : "border border-gray-200"
                            }`}
                            onClick={() => setSelectedRace(race.name)}
                        >
                            <h2 className="text-xl font-bold text-center">{race.name}</h2>
                            <p className="text-gray-700 mt-2 text-center">{race.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Character Preview */}
            <div className="mt-8 p-6 shadow-lg rounded-lg w-80 text-center border border-gray-300">
                <h3 className="text-xl font-bold">Character Preview</h3>
                <p className="text-lg">{selectedRace || "?"} {selectedClass || "?"}</p>

                {/* Character Name Input */}
                <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="Enter character name"
                    className="border rounded-lg px-3 py-2 w-full mt-4 text-center"
                />

                {/* Level Selection */}
                <h3 className="text-lg font-semibold mt-4">Level: {level}</h3>
                <input
                    type="range"
                    min="1"
                    max="20"
                    value={level}
                    onChange={(e) => setLevel(parseInt(e.target.value))}
                    className="w-full mt-2"
                />

                {/* Confirm Button */}
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
        </main>
    );
}
