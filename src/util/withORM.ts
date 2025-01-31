import { MikroORM, RequestContext } from '@mikro-orm/core';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import config from '../config/mikro-orm';

const getORM = async () => {
    // @ts-ignore
    if (!global.__MikroORM__){
        // @ts-ignore
        global.__MikroORM__ = await MikroORM.init(config)
            // specific to in-memory sqlite
            .then(async orm => {
                const generator = orm.getSchemaGenerator();
                await generator.createSchema().catch();
                return orm;
            })
    }
    // @ts-ignore
    return global.__MikroORM__;
};

const withORM = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const orm = await getORM();
    return RequestContext.create(orm.em, async () => handler(req, res));
}

export default withORM;
