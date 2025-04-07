// app/campaigns/view/page.tsx
import { CharacterCard, EmptyCharacterCard } from "@/components/characters/CharacterCard";
import ReportContent from "@/components/reports/ReportContent";
import TopBar from "@/components/TopBar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { leaveCampaign } from "@/lib/actions/campaigns";
import { auth } from "@/lib/auth";
import query from "@/lib/database";
import { artifika } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Campaign } from "@/types/Campaign";
import { Character } from "@/types/Character";
import { ContentType } from "@/types/Report";
import { Session } from "@/types/Session";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type SessionSignup = {
    session_id: number;
    character_id: number;
    character_name: string;
};

type UserCharacter = {
    character_id: number;
    character_name: string;
};

type CampaignViewPageProps = {
    params: Promise<{ campaignId?: string }>;
};

/**
 * CampaignViewPage renders the view for a single campaign
 *
 * This page component performs the following tasks:
 *  Authenticates the current user
 *  Retrieves campaign details from the database
 *  Verifies that a valid campaignId is provided otherwise it redirects
 *  Checks if the current user is the campaign Dungeon Master (DM)
 *  Queries sessions related to the campaign, along with session signups
 *  Retrieves current user's characters that are part of this campaign (for non-DM users)
 *  Retrieves all characters that belong to the campaign
 *  Renders the campaign header, details (collapsible section), character party and sessions list
 *  Displays DM-only controls (Manage Campaign, Create Session) and join options for non-DM users
 *
 * @param {CampaignViewPageProps} props - The component props containing params with campaignId
 * @returns {Promise<JSX.Element>} A React component displaying the campaign view
 */

export default async function CampaignViewPage({ params }: CampaignViewPageProps) {
    const sessionData = await auth();
    const { campaignId } = await params;
    if (!campaignId) {
        redirect("/campaigns");
    }

    // Query campaign details.
    const campaigns = await query<Campaign[]>(`
        SELECT c.*, u.display_name AS dungeon_master_name
        FROM campaign c
                 JOIN \`user\` u ON u.id = c.dungeon_master_id
        WHERE c.id = ?
    `, [ campaignId ]);

    const campaign = campaigns[0];
    if (!campaign) {
        redirect("/campaigns");
    }

    // Check if current user is the DM (owner).
    const currUserIsOwner =
        sessionData &&
        sessionData.user &&
        campaign.dungeon_master_id.toString() === sessionData.user.id;

    // Query sessions for this campaign.
    const sessions = await query<Session[]>(`
        SELECT id, title, excerpt, writeup, session_date, signup_deadline
        FROM session
        WHERE campaign_id = ?
        ORDER BY session_date ASC
    `, [ campaign.id ]);

    // Query signups for sessions.
    let signups: SessionSignup[] = [];
    if (sessions.length > 0) {
        const sessionIds = sessions.map(s => s.id).join(",");
        signups = await query<SessionSignup[]>(`
            SELECT sc.session_id, c.id AS character_id, c.name AS character_name
            FROM session_characters sc
                     JOIN \`character\` c ON c.id = sc.character_id
            WHERE sc.session_id IN (${ sessionIds })
        `);
    }
    const signupsBySession: Record<number, SessionSignup[]> = {};
    for (const s of signups) {
        if (!signupsBySession[s.session_id]) {
            signupsBySession[s.session_id] = [];
        }
        signupsBySession[s.session_id].push(s);
    }

    // Query current user's characters that are part of this campaign.
    let userCharacters: UserCharacter[] = [];
    if (sessionData?.user && !currUserIsOwner) {
        userCharacters = await query<UserCharacter[]>(`
            SELECT c.id AS character_id, c.name AS character_name
            FROM \`character\` c
            WHERE c.owner_id = ?
              AND c.id IN (SELECT character_id
                           FROM campaign_characters
                           WHERE campaign_id = ?)
        `, sessionData.user.id, campaign.id);
    }

    // Query all characters in campaign
    const charactersInCampaign = await query<Character[]>(`
        SELECT c.*,
               cl.name AS class_name
        FROM campaign_characters cc
                 JOIN \`character\` c ON c.id = cc.character_id
                 JOIN class cl ON cl.id = c.class_id
        WHERE campaign_id = ?
    `, campaignId);

    return (
        <main className="content">
            <TopBar
                title={ campaign.name }
                backText={ "Campaigns" }
                backLink={ "/campaigns" }
                endContent={
                    /* DM-only controls */
                    <div className="flex justify-end gap-2">
                        { currUserIsOwner && (<>
                            <Link
                                href={ `/campaigns/${ campaign.id }/manage` }
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Manage Campaign
                            </Link>
                            <Link
                                href={ `/campaigns/${ campaign.id }/sessions/create` }
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Create Session
                            </Link>
                        </>) }
                        {/* For non-DM users who are not campaign members, display a join campaign button */ }
                        {/*{ !currUserIsOwner && userCharacters.length === 0 && (*/ }
                        {/*    <Link*/ }
                        {/*        href={ `/campaigns/join?campaignId=${ campaign.id }` }*/ }
                        {/*        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"*/ }
                        {/*    >*/ }
                        {/*        Join Campaign*/ }
                        {/*    </Link>*/ }
                        {/*) }*/ }
                        { !currUserIsOwner && userCharacters.length > 0 &&
                            <form
                                action={ async () => {
                                    "use server";
                                    await leaveCampaign(campaign.id);
                                } }
                            ><Button type="submit" variant="destructive">Leave</Button></form>
                        }
                        <ReportContent contentId={ campaign.id } contentType={ ContentType.CAMPAIGN }/>
                    </div>
                }
            />

            {/* Campaign details */ }
            <div className="space-y-4 flex flex-col items-start">
                { campaign.banner && (
                    <Image
                        width={ 1500 }
                        height={ 500 }
                        src={ campaign.banner }
                        alt={ `${ campaign.name } Banner` }
                        className="rounded-lg max-w-[1000px] self-center campaign-banner"
                    />
                ) }
                <div className="w-full md:w-3/4 lg:w-1/2 mx-auto">
                    <Collapsible>
                        <CollapsibleTrigger
                            className={ cn("flex items-center gap-2 mb-4", buttonVariants({ variant: "ghost" })) }
                        >
                            Details
                            <ChevronsUpDown size={ 16 }/>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-4">
                            <div className="flex items-center">
                                <strong className="mr-1">Dungeon Master:</strong>
                                { campaign.dungeon_master_name }
                                <div className="scale-75">
                                    <ReportContent
                                        contentType={ ContentType.USER }
                                        contentId={ campaign.dungeon_master_id }
                                        discrete
                                    />
                                </div>
                            </div>
                            <pre className={ `w-full text-wrap ${ artifika.className }` }>{ campaign.outline }</pre>
                            <div>
                                <h2 className="text-xl mb-2">Party</h2>
                                <div className="grid grid-cols-2 gap-2">
                                    { charactersInCampaign.length > 0
                                        ? charactersInCampaign.map(character => (
                                            <div key={ character.id } className="basis-1/2">
                                                <CharacterCard character={ character } showReport/>
                                            </div>
                                        ))
                                        : <EmptyCharacterCard message="The party is empty"/>
                                    }
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>

            {/*<div className="block min-h-[2000px] min-w-10 bg-red-500"></div>*/ }

            {/* Sessions Section */ }
            <div>
                <h2 className="text-3xl font-semibold text-center mb-4">Upcoming Sessions</h2>
                { sessions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        { sessions.map((sess) => {
                            const sessSignups = signupsBySession[sess.id] || [];
                            // Check if current user's characters have signed up for this session.
                            const userHasJoined = userCharacters.some((uc) =>
                                sessSignups.some((signup) => signup.character_id === uc.character_id),
                            );
                            return (
                                <div key={ sess.id } className="border p-4 rounded shadow hover:shadow-lg">
                                    <h3 className="text-2xl font-bold">{ sess.title }</h3>
                                    <p className="text-gray-600">
                                        <strong>Date:</strong> { new Date(sess.session_date).toLocaleString("en-US") }
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Signup
                                            Deadline:</strong> { new Date(sess.signup_deadline).toLocaleString("en-US") }
                                    </p>
                                    { sess.excerpt && <p className="mt-2">{ sess.excerpt }</p> }
                                    { sess.writeup && (
                                        <p className="mt-2 text-sm text-gray-500">{ sess.writeup }</p>
                                    ) }
                                    <div className="mt-4">
                                        <h4 className="font-semibold">Signed Up Characters:</h4>
                                        { sessSignups.length > 0 ? (
                                            <ul className="list-disc list-inside">
                                                { sessSignups.map((signup) => (
                                                    <li key={ signup.character_id }>{ signup.character_name }</li>
                                                )) }
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">No sign-ups yet.</p>
                                        ) }
                                    </div>
                                    {/* If current user is a member and hasn't joined, show a join button */ }
                                    { userCharacters.length > 0 && !userHasJoined && (
                                        <div className="mt-4">
                                            <Link
                                                href={ `/src/app/@appRoutes/campaigns/(campaignView)/session/join?sessionId=${ sess.id }&campaignId=${ campaign.id }&characterId=${ userCharacters[0].character_id }` }
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Join Session
                                            </Link>
                                        </div>
                                    ) }
                                    {/* If DM, allow deletion */ }
                                    { currUserIsOwner && (
                                        <div className="mt-4">
                                            <Link
                                                href={ `/campaigns/session/delete?sessionId=${ sess.id }&campaignId=${ campaign.id }` }
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Delete Session
                                            </Link>
                                        </div>
                                    ) }
                                    {/* If user has joined, display a confirmation */ }
                                    { userHasJoined && (
                                        <p className="mt-4 text-green-600 font-semibold">
                                            You are signed up for this session.
                                        </p>
                                    ) }
                                </div>
                            );
                        }) }
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        No sessions have been scheduled for this campaign.
                    </p>
                ) }
            </div>
        </main>
    );
}
