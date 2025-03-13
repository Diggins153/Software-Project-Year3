import query from "@/lib/database";

type RaceUsage = {
    name: string;
    usage_count: number;
};

type ClassUsage = {
    name: string;
    usage_count: number;
};

export default async function StatisticsPage() {
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

    return (
        <main className="p-6">
            <h1 className="text-4xl font-bold mb-8 text-center">Usage Statistics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-center">Most Used Races</h2>
                    <table className="min-w-full border-collapse">
                        <thead>
                        <tr>
                            <th className="border px-4 py-2">Race</th>
                            <th className="border px-4 py-2">Usage Count</th>
                        </tr>
                        </thead>
                        <tbody>
                        {mostUsedRaces.map((race) => (
                            <tr key={race.name}>
                                <td className="border px-4 py-2">{race.name}</td>
                                <td className="border px-4 py-2 text-center">{race.usage_count}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-center">Least Used Races</h2>
                    <table className="min-w-full border-collapse">
                        <thead>
                        <tr>
                            <th className="border px-4 py-2">Race</th>
                            <th className="border px-4 py-2">Usage Count</th>
                        </tr>
                        </thead>
                        <tbody>
                        {leastUsedRaces.map((race) => (
                            <tr key={race.name}>
                                <td className="border px-4 py-2">{race.name}</td>
                                <td className="border px-4 py-2 text-center">{race.usage_count}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-center">Most Used Classes</h2>
                    <table className="min-w-full border-collapse">
                        <thead>
                        <tr>
                            <th className="border px-4 py-2">Class</th>
                            <th className="border px-4 py-2">Usage Count</th>
                        </tr>
                        </thead>
                        <tbody>
                        {mostUsedClasses.map((cls) => (
                            <tr key={cls.name}>
                                <td className="border px-4 py-2">{cls.name}</td>
                                <td className="border px-4 py-2 text-center">{cls.usage_count}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-center">Least Used Classes</h2>
                    <table className="min-w-full border-collapse">
                        <thead>
                        <tr>
                            <th className="border px-4 py-2">Class</th>
                            <th className="border px-4 py-2">Usage Count</th>
                        </tr>
                        </thead>
                        <tbody>
                        {leastUsedClasses.map((cls) => (
                            <tr key={cls.name}>
                                <td className="border px-4 py-2">{cls.name}</td>
                                <td className="border px-4 py-2 text-center">{cls.usage_count}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </main>
    );
}
