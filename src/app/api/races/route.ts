import query from "@/lib/database";
import { Race } from "@/types/Race";

export const dynamic = "force-static";

export async function GET() {
    const races = await query<Race[]>(`
        SELECT *
        FROM race
        ORDER BY name
    `);
    return Response.json(races);
}