import query from "@/lib/database";
import { PremadeCharacter } from "@/types/PremadeCharacter";

export const dynamic = "force-static";

export async function GET() {
    const characters = await query<PremadeCharacter[]>(`
        SELECT pc.*,
               c.name AS class_name,
               r.name AS race_name
        FROM premade_character pc
                 JOIN class c ON c.id = pc.class_id
                 JOIN race r ON r.id = pc.race_id
    `);
    return Response.json(characters);
}