import type { Config, ServerlessMysql } from "serverless-mysql";

const mysql: ServerlessMysql = require("serverless-mysql")({
    config: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DB,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        connectionLimit: 1,
    },
} as Config);

export default async function query(query: string, ...params: any[]) {
    return await mysql.query(query, params);
}