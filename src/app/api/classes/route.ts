import query from "@/lib/database";
import { Class } from "@/types/Class";

export const dynamic = "force-static";

export async function GET() {
    const classes = await query<Class[]>(`
        SELECT *
        FROM class
        ORDER BY name
    `);
    return Response.json(classes);
}