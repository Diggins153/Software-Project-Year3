import { Campaign } from "@/entities/Campaign";
import { Character } from "@/entities/Character";
import { CharacterClasses } from "@/entities/CharacterClasses";
import { Class } from "@/entities/Class";
import { Race } from "@/entities/Race";
import { User } from "@/entities/User";
import { Options } from "@mikro-orm/core";
import { defineConfig, MySqlDriver } from "@mikro-orm/mysql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

const config: Options = defineConfig({
    driver: MySqlDriver,
    metadataProvider: TsMorphMetadataProvider,
    // WARNING: Entities must be specified explicitly
    entities: [
        Campaign,
        Character,
        CharacterClasses,
        Class,
        Race,
        User,
    ],
    entitiesTs: [
        Campaign,
        Character,
        CharacterClasses,
        Class,
        Race,
        User,
    ],
    dbName: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT!),
    debug: process.env.DEBUG === "true",
    // WARNING: Keep the discovery option as is
    discovery: { disableDynamicFileAccess: true },
    pool: { min: 0, max: 1 },
});

export default config;
