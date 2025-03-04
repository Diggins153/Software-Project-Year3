import type { Config, ServerlessMysql } from "serverless-mysql";

let mysql: ServerlessMysql | null = null;

export default async function getDB(): Promise<ServerlessMysql> {
    if (mysql == null || !mysql) {
        mysql = require("serverless-mysql")({
            config: {
                host: process.env.MYSQL_HOST,
                port: process.env.MYSQL_PORT,
                database: process.env.MYSQL_DB,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                connectionLimit: 1,
            },
        } as Config) as ServerlessMysql;
    }

    return mysql;
}