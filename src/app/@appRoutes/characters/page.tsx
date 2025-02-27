import Link from "next/link";

export default function Characters() {
    return (
        <main className="p-6 flex flex-col items-center gap-6">
            <h1 className="text-3xl font-bold text-center">Create Your Character</h1>
            <div className="flex flex-col gap-6">
                {/* Premade Character Card */}
                <Link href="/characters/pre-made">
                    <div className="w-[300px] p-6 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-2xl hover:scale-105 hover:border-gray-400 active:scale-95 cursor-pointer">
                        <h2 className="text-xl font-bold text-gray-800">Choose a Premade Character</h2>
                        <p className="text-gray-600 mt-2">
                            Browse a selection of pre-built characters, ready for adventure.
                            Perfect for those who want to jump into the game quickly!
                        </p>
                    </div>
                </Link>

                {/* Custom Character Card */}
                <Link href="/appRoutes/characters/create">
                    <div className="w-[300px] p-6 bg-white rounded-lg shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-2xl hover:scale-105 hover:border-gray-400 active:scale-95 cursor-pointer">
                        <h2 className="text-xl font-bold text-gray-800">Make It Your Way</h2>
                        <p className="text-gray-600 mt-2">
                            Design your own character from scratch with complete creative freedom.
                            Choose your race, class, abilities, and more!
                        </p>
                    </div>
                </Link>
            </div>
        </main>
    );
}
