import Image from "next/image";

export default function ClassToken({ className }: { className: string }) {
    return <div className="flex gap-1 items-center">
        <div className="bg-white border-2 rounded-full p-1">
            <Image
                className="aspect-square min-w-[25px]"
                src={ `/classes/${ className }.svg` }
                alt={ `${ className } class` }
                width={ 25 }
                height={ 25 }
            />
        </div>
        <span className="text-lg">{ className }</span>
    </div>;
}