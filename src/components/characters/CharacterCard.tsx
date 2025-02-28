import Image from "next/image";

export default async function CharacterCard({ name, image }: { name: string, image: string }) {
    return <div className="bg-yellow-100 text-black">
        <Image src={ image } alt="" width={ 75 } height={ 75 }/>
        { name }
    </div>;
}