"use client";

import { Class } from "@/types/Class";
import { Race } from "@/types/Race";
import { Loader2, MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createCharacter } from "@/lib/actions/characters";

/**
 * Character creation component with a step-by-step selection process
 * @returns {JSX.Element} - The character creation UI
 */
export default function CreateCharacter() {
    // currentPage 0: Race Selection; 1: Class Selection; 2: Review & Confirm
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 3;
    const pageTitles = ["Race Selection", "Class Selection", "Review & Confirm"];
    const [isLoading, setLoading] = useState<boolean>(true);
    const [classes, setClasses] = useState<Class[]>([]);
    const [races, setRaces] = useState<Race[]>([]);

    const [selectedRace, setSelectedRace] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [characterName, setCharacterName] = useState("");
    const [level, setLevel] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function fetchClasses() {
            const res = await fetch("/api/classes", { cache: "force-cache" });
            if (res.ok) {
                setClasses(await res.json());
            } else {

            }
        }

        async function fetchRaces() {
            const res = await fetch("/api/races", { cache: "force-cache" });
            if (res.ok) {
                setRaces(await res.json());
            }
        }

        fetchClasses();
        fetchRaces();
    }, []);

    useEffect(() => {
        if (classes.length > 0 && races.length > 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [classes, races]);

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

    if (isLoading) return <main className="flex items-center justify-center gap-4 relative p-8 min-h-screen">
        <Loader2 className="animate-spin ease-in-out" size={48}/>
        <h3 className="text-xl">Loading Character Creator</h3>
    </main>

    return (
        <main className="relative p-8 min-h-screen">
            {/* Pagination Navigation with Arrow Buttons, Labels, and Hover Effects */}
            <div className="absolute top-4 left-4 flex items-center group">
                {currentPage > 0 && (
                    <button onClick={goBack} className="flex items-center text-3xl mr-2 transition-all duration-300 group-hover:scale-125 origin-left">
                        <MoveLeftIcon/>
                        <span className="text-lg font-medium transition-all duration-300 opacity-0 group-hover:opacity-100">
                            Previous: {pageTitles[currentPage - 1]}
                        </span>
                    </button>
                )}
            </div>
            <div className="absolute top-4 right-4 flex items-center group">
                {currentPage < totalPages - 1 && (
                    <button onClick={goNext} className="flex items-center text-3xl transition-all duration-300 group-hover:scale-125 origin-right">
                        <span className="text-lg font-medium mr-2 transition-all duration-300 opacity-0 group-hover:opacity-100">
                            Next: {pageTitles[currentPage + 1]}
                        </span>
                        <MoveRightIcon/>
                    </button>
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
