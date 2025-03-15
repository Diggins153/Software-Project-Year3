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

type User = {
    id: number;
    display_name: string;
    email: string;
};

type Report = {
    id: number;
    content_type: string;
    content_id: number;
    reason: string;
    user_description: string;
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

    // Query for campaigns (fetch ID, name, and DM's display name)
    const campaigns: Campaign[] = await query<Campaign[]>(`
        SELECT c.id, c.name, u.display_name AS dungeon_master_name
        FROM campaign c
                 JOIN \`user\` u ON u.id = c.dungeon_master_id
        ORDER BY c.id ASC
    `);

    // Query for users (fetch id, display_name, email)
    const users: User[] = await query<User[]>(`
        SELECT id, display_name, email
        FROM \`user\`
        ORDER BY id ASC
    `);

    // Query for reports
    const reports: Report[] = await query<Report[]>(`
    SELECT id, content_type, content_id, reason, user_description
    FROM reports
    WHERE status = 'active'
    ORDER BY id ASC
  `);

    return (
        <AdminDashboard
            mostUsedRaces={mostUsedRaces}
            leastUsedRaces={leastUsedRaces}
            mostUsedClasses={mostUsedClasses}
            leastUsedClasses={leastUsedClasses}
            // @ts-ignore
            campaigns={campaigns}
            // @ts-ignore
            users={users}
            // @ts-ignore
            reports={reports}
        />
    );
}
