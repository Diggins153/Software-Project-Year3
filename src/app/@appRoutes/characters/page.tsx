import CharacterCard from "@/components/characters/CharacterCard";

export default function Characters() {
    const characters = [
        { id: 1, name: "Arskit", image: "https://placehold.co/75.jpg" },
        { id: 2, name: "Niklas Eeroson", image: "https://placehold.co/75.jpg" },
    ];

    return <main>
        <h1 className="text-2xl">Characters Page</h1>
        { characters.map(character => <CharacterCard key={ character.id } { ...character }/>) }
    </main>;
}
