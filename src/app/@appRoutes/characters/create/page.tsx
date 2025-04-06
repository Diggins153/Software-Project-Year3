import Link from "next/link";

/**
 * Character selection page where users can create or view their characters
 * Provides options to choose a premade character, create a new one, or manage existing characters
 *
 * @returns {JSX.Element} - The character selection page UI
 */
export default async function CharactersPage() {
    return (
        <main>

            <div className="p-6 flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold text-center">Create Your Character</h1>

                <div className="flex gap-6 justify-center">
                    <Link href="/characters/create/premade">
                        <div className="w-[300px] h-[750px] p-6 bg-yellow-200 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-2xl hover:scale-105 hover:border-gray-400 active:scale-95 cursor-pointer flex flex-col">
                            <div className="mt-4 text-center">
                                <h2 className="text-xl font-bold text-gray-800">Choose a Premade Character</h2>
                            </div>
                            <div className="flex-grow flex items-center justify-center">
                                <p className="text-gray-600 text-center">
                                    Browse a selection of pre-built characters, ready for adventure.
                                    Perfect for those who want to jump into the game quickly!
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/characters/create/custom">
                        <div className="w-[300px] h-[750px] p-6 bg-yellow-200 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-2xl hover:scale-105 hover:border-gray-400 active:scale-95 cursor-pointer flex flex-col">
                            <div className="mt-4 text-center">
                                <h2 className="text-xl font-bold text-gray-800">Make It Your Way</h2>
                            </div>
                            <div className="flex-grow flex items-center justify-center">
                                <p className="text-gray-600 text-center">
                                    Design your own character from scratch with complete creative freedom.
                                    Choose your race, class, abilities, and more!
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

            </div>
        </main>
    );
}
