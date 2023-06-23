import { getAppeals, deleteAppeals } from '../../services/appeals';

const handlers = {
  read: async ctx => {
    try {
      const appeals = await getAppeals();
      ctx.status = 200;
      const body = {
        appeals,
      };
      ctx.body = body;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  delete: async ctx => {
    const { ids } = ctx.request.body;

    if (!ids || !Array.isArray(ids)) {
      return (ctx.status = 400);
    }

    try {
      await deleteAppeals(ids);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
