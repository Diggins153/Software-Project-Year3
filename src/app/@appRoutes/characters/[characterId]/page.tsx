import CharacterActionsDropdown from "@/components/characters/CharacterActionsDropdown";
import ClassToken from "@/components/characters/ClassToken";
import TopBar from "@/components/TopBar";
import query from "@/lib/database";
import { Campaign } from "@/types/Campaign";
import { Character } from "@/types/Character";
import { auth } from "@/lib/auth";
import { Class } from "@/types/Class";
import { Race } from "@/types/Race";
import Image from "next/image";
import { redirect } from "next/navigation";

/**
 * CharacterPage component displays character details including name, race, classes,
 * and associated campaigns Provides an action dropdown for the owner
 *
 * @param {{ params: Promise<{ characterId: number; }> }} props - Component props
 * @returns {Promise<JSX.Element>} - The character page component
 */
export default async function CharacterPage({ params }: { params: Promise<{ characterId: number; }> }) {
    const session = await auth();
    const characterId = (await params).characterId;
    const character = (await query<Character[]>(`
        SELECT c.*,
               r.name  AS race_name,
               cl.name AS class_name
        FROM \`character\` c
                 JOIN race r ON r.id = c.race_id
                 JOIN class cl ON cl.id = c.class_id
        WHERE c.id = ?
    `, characterId))[0] || null;

    if (!session || !session.user || !character) {
        redirect("/characters");
    }

    const { owner_id, image = "", name, race_name, class_name, level } = character;
    const currUserIsOwner = owner_id.toString() === session.user.id;
    const classes = await query<Class[]>("SELECT * FROM `class`");
    const races = await query<Race[]>("SELECT * FROM race");
    const characterCampaigns = await query<Campaign[]>("SELECT campaign.* FROM campaign JOIN campaign_characters cc ON campaign.id = cc.campaign_id WHERE cc.character_id = ?", characterId);

    return <main className="content">
        <TopBar
            title={ character.name }
            backText="Characters"
            backLink="/characters"
            endContent={
                currUserIsOwner &&
                <CharacterActionsDropdown
                    character={ character }
                    classes={ classes }
                    races={ races }
                    characterCampaigns={ characterCampaigns }
                />
            }
        />
        <div className="w-full md:w-3/4 lg:w-1/2 xl:w-2/5 mx-auto pt-4">
            {/*Character Card*/ }
            <div className="bg-yellow-200 text-black flex flex-col items-center justify-center mt-[calc(75px/2)] rounded-lg pb-2">
                <div className="relative top-[calc(-75px/2)] mb-[calc(-75px/2)]">
                    { image
                        ? <Image src={ image } alt="" width={ 75 } height={ 75 } className="rounded-full"/>
                        : <div className="bg-white w-[75px] h-[75px] rounded-full"></div>
                    }
                </div>
                <div className="flex justify-between w-full mx-auto px-2 py-1 self-start mt-[calc(-75px/2)]">
                    <div className="text-xl grow basis-0">
                        { name }
                    </div>
                    <div className="w-[75px] mx-3"></div>
                    <div className="text-right grow basis-0">
                        { race_name }
                    </div>
                </div>
                <div className="flex flex-col w-full mt-2.5 gap-2.5">
                    <div className="flex flex-wrap justify-center gap-y-2">
                        <div className="basis-1/2">
                            <ClassToken className={ class_name! } level={ level }/>
                        </div>
                    </div>
                </div>
            </div>
            {/*Posts*/ }
            <div className="text-center mt-4 text-xl">
                Here be posts...
            </div>
        </div>
    </main>;
}
