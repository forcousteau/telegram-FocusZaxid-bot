import { isObject } from '../../services/functions';
import { addRegion, getRegions, updateRegion } from '../../services/regions';

const handlers = {
  create: async ctx => {
    const { name, price } = ctx.request.body;

    if (!name || !price) {
      return (ctx.status = 400);
    }

    try {
      await addRegion({ name, price });
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  read: async ctx => {
    try {
      const regions = await getRegions();
      ctx.status = 200;
      const body = {
        regions,
      };
      ctx.body = body;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  update: async ctx => {
    const { id, data } = ctx.request.body;

    if (!id || !data || !isObject(data) || !Object.keys(data).length) {
      return (ctx.status = 400);
    }

    try {
      await updateRegion(id, data);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
