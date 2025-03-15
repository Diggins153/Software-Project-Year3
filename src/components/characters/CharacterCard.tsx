import ClassTokens from "@/components/characters/ClassTokens";
import ReportContent from "@/components/reports/ReportContent";
import { Character } from "@/types/Character";
import { ContentType } from "@/types/Report";
import Image from "next/image";

export async function CharacterCard({ character, showReport = false }: { character: Character, showReport?: boolean }) {
    const { id, image = "", name, class_name, level } = character;

    return <div
        className="relative bg-yellow-200 text-black flex flex-col items-center justify-center mt-[calc(75px/2)] rounded-lg border-2 border-transparent w-full"
    >
        <div className="relative top-[calc(-75px/2)] mb-[calc(-75px/2)]">
            { image
                ? <Image src={ image } alt="" width={ 75 } height={ 75 } className="rounded-full bg-white"/>
                : <div className="h-[75px] w-[75px] bg-white rounded-full"></div>
            }
            { class_name &&
                <div className="absolute left-full top-full -translate-y-full -translate-x-[25px]">
                    <ClassTokens className={ class_name } level={ level }/>
                </div>
            }
        </div>
        <div className="text-lg p-1 ">
            <span className="select-none text-center">{ name }</span>
        </div>
        { showReport &&
            <div className="scale-75 absolute top-0 right-0">
                <ReportContent
                    contentType={ ContentType.CHARACTER }
                    contentId={ character.id }
                    discrete
                />
            </div>
        }
    </div>;
}

export async function EmptyCharacterCard({ message }: { message: string }) {
    return <div
        className="bg-yellow-200 text-black flex flex-col items-center justify-center rounded-lg min-h-[calc(1rem+75px)]"
    >
        <p className="text-lg p-1 select-none text-center">
            { message }
        </p>
    </div>;
}