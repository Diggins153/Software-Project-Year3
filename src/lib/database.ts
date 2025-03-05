import type { Config, ServerlessMysql } from "serverless-mysql";

let mysql: ServerlessMysql = require("serverless-mysql")({
    config: {
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT ?? "3306"),
        database: process.env.MYSQL_DB,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        connectionLimit: 1,
    },
} satisfies Config);

export default async function query<T>(query: string, ...args: any[]): Promise<T> {
    return await mysql.query<T>(query, args);
}