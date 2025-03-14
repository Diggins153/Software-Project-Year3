import query from "@/lib/database";
// @ts-ignore
import AdminDashboard from "@/components/AdminDashboard/page.tsx";

type RaceUsage = {
    name: string;
    usage_count: number;
};

type ClassUsage = {
    name: string;
    usage_count: number;
};

type Campaign = {
    id: number;
    name: string;
    dungeon_master_name: string;
};

export default async function AdminDashboardPage() {
    // Query for most used races (by counting characters per race)
    const mostUsedRaces: RaceUsage[] = await query<RaceUsage[]>(`
        SELECT r.name, COUNT(c.id) AS usage_count
        FROM race r
                 LEFT JOIN \`character\` c ON c.race_id = r.id
        GROUP BY r.id
        ORDER BY usage_count DESC
    `);

    // Query for least used races
    const leastUsedRaces: RaceUsage[] = await query<RaceUsage[]>(`
        SELECT r.name, COUNT(c.id) AS usage_count
        FROM race r
                 LEFT JOIN \`character\` c ON c.race_id = r.id
        GROUP BY r.id
        ORDER BY usage_count ASC
    `);

    // Query for most used classes (by counting characters per class)
    const mostUsedClasses: ClassUsage[] = await query<ClassUsage[]>(`
        SELECT cl.name, COUNT(c.id) AS usage_count
        FROM \`class\` cl
                 LEFT JOIN \`character\` c ON c.class_id = cl.id
        GROUP BY cl.id
        ORDER BY usage_count DESC
    `);

    // Query for least used classes
    const leastUsedClasses: ClassUsage[] = await query<ClassUsage[]>(`
        SELECT cl.name, COUNT(c.id) AS usage_count
        FROM \`class\` cl
                 LEFT JOIN \`character\` c ON c.class_id = cl.id
        GROUP BY cl.id
        ORDER BY usage_count ASC
    `);

    // Query for campaigns (example: fetch ID, name, and DM's display name)
    const campaigns: Campaign[] = await query<Campaign[]>(`
    SELECT c.id, c.name, u.display_name AS dungeon_master_name
    FROM campaign c
    JOIN \`user\` u ON u.id = c.dungeon_master_id
    ORDER BY c.id ASC
  `);

    return (
        <AdminDashboard
            mostUsedRaces={mostUsedRaces}
            leastUsedRaces={leastUsedRaces}
            mostUsedClasses={mostUsedClasses}
            leastUsedClasses={leastUsedClasses}
            // @ts-ignore
            campaigns={campaigns}  // Pass campaigns to the AdminDashboard component
        />
    );
}
