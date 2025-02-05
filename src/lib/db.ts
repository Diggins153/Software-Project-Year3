import knex from "knex";

export const db = knex({
    client: "mysql2",
    connection: {
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT!),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
    },
    pool: {
        max: 1,
        min: 0,
    },
});
