import { Class } from "@/entities/Class";
import { Payment } from "@/entities/Payment";
import { Race } from "@/entities/Race";
import { User } from "@/entities/User";
import { VerificationCode } from "@/entities/VerificationCode";
import { Options } from "@mikro-orm/core";
import { MySqlDriver } from "@mikro-orm/mysql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

const config: Options = {
    metadataProvider: TsMorphMetadataProvider,
    dbName: process.env.MYSQL_DB,
    driver: MySqlDriver,
    entities: [
        User,
        Class,
        Payment,
        Race,
        VerificationCode,
    ],
    debug: process.env.DEBUG === "true" || process.env.DEBUG?.includes("db"),
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: parseInt(process.env.MYSQL_PORT!),
};

export default config;
