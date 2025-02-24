import { Options } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

const config: Options = {
    driver: MySqlDriver,
    metadataProvider: TsMorphMetadataProvider,
    entities: [ "src/entities/*.ts", ],
    entitiesTs: [ "src/entities/*.ts", ],
    dbName: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT!),
    debug: process.env.DEBUG === "true",
    discovery: { disableDynamicFileAccess: false },
};

export default config;
