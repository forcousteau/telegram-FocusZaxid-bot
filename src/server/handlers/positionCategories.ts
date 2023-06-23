import { isObject } from '../../services/functions';
import { addPositionCategory, getPositionCategories, updatePositionCategory } from '../../services/positionCategories';

const handlers = {
  create: async ctx => {
    const { name } = ctx.request.body;

    if (!name) {
      return (ctx.status = 400);
    }

    try {
      await addPositionCategory(name);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  read: async ctx => {
    try {
      const positionCategories = await getPositionCategories();
      ctx.status = 200;
      const body = {
        positionCategories,
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
      await updatePositionCategory(id, data);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
