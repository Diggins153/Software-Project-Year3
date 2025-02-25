import { Character } from "@/entities/Character";
import { Class } from "@/entities/Class";
import { Race } from "@/entities/Race";
import { User } from "@/entities/User";
import { Options } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

const config: Options = {
    driver: MySqlDriver,
    metadataProvider: TsMorphMetadataProvider,
    // WARNING: Entities must be specified explicitly
    entities: [
        Character,
        Class,
        Race,
        User,
    ],
    entitiesTs: [
        Character,
        Class,
        Race,
        User
    ],
    dbName: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT!),
    debug: process.env.DEBUG === "true",
    // WARNING: Keep the discovery option as is
    discovery: { disableDynamicFileAccess: true },
};

export default config;
