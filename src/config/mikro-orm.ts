// import { Class } from "@/entities/Class";
// import { Payment } from "@/entities/Payment";
// import { Race } from "@/entities/Race";
// import { VerificationCode } from "@/entities/VerificationCode";
import { User } from "@/entities/User";
import { Options } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

const config: Options = {
    driver: MySqlDriver,
    metadataProvider: TsMorphMetadataProvider,
    entities: [
        User,
        // Class,
        // Payment,
        // Race,
        // VerificationCode,
    ],
    dbName: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT!),
    debug: process.env.DEBUG === "true" || process.env.NODE_ENV == "development",
    discovery: { disableDynamicFileAccess: true },
};

export default config;
