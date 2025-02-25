import config from "@/config/mikro-orm";
import { MikroORM } from "@mikro-orm/core";

let orm: MikroORM | null = null;

export default async function getORM() {
    if (orm == null) {
        orm = await MikroORM.init(config);

        await orm.migrator.up();
    }

    return orm.em.fork();
}