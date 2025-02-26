import config from "@/config/mikro-orm";
import { MikroORM } from "@mikro-orm/core";

let orm: MikroORM | null = null;

export default async function getORM() {
    if (orm == null) orm = await MikroORM.init(config);

    return orm.em.fork();
}