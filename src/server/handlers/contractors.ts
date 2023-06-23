import { isObject } from '../../services/functions';
import { addContractor, getContractors, updateContractor, deleteContractors } from '../../services/contractors';

const handlers = {
  create: async ctx => {
    const { fullName } = ctx.request.body;

    if (!fullName) {
      return (ctx.status = 400);
    }

    try {
      await addContractor(fullName);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  read: async ctx => {
    try {
      const contractors = await getContractors();
      ctx.status = 200;
      const body = {
        contractors,
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
      await updateContractor(id, data);
      ctx.status = 200;
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
      await deleteContractors(ids);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
