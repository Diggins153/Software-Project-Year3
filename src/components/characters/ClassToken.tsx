import Image from "next/image";

export default function ClassToken({ className, level }: { className: string, level: number }) {
    return <div className="flex gap-1 items-center justify-center">
        <div className="bg-white border-2 rounded-full p-1">
            <Image
                className="aspect-square min-w-[25px] w-[25px] min-h-[25px] h-[25px]"
                src={ `/classes/${ className }.svg` }
                alt={ `${ className } class` }
                width={ 25 }
                height={ 25 }
            />
        </div>
        <span className="text-lg">Lvl. { level } { className }</span>
    </div>;
}