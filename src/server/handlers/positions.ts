import { isObject } from '../../services/functions';
import { addPosition, getPositionsForAdminPanel, updatePosition } from '../../services/positions';

const handlers = {
  create: async ctx => {
    const { positionCategoryId, name, price } = ctx.request.body;

    if (!positionCategoryId || !name || !price) {
      return (ctx.status = 400);
    }

    try {
      await addPosition({
        positionCategoryId,
        name,
        price,
      });
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  read: async ctx => {
    try {
      const positions = await getPositionsForAdminPanel();
      ctx.status = 200;
      const body = {
        positions,
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
      await updatePosition(id, data);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
