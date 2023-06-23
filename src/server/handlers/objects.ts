import { isObject } from '../../services/functions';
import { addObject, getObjectsForAdminPanel, updateObject } from '../../services/objects';

const handlers = {
  create: async ctx => {
    const { regionId, city, address, contractorId } = ctx.request.body;

    if (!regionId || !city || typeof address !== 'string') {
      return (ctx.status = 400);
    }

    try {
      await addObject({
        regionId,
        city,
        address,
        contractorId,
      });
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  read: async ctx => {
    try {
      const objects = await getObjectsForAdminPanel();
      ctx.status = 200;
      const body = {
        objects,
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
      await updateObject(id, data);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
