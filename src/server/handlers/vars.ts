import { isObject } from '../../services/functions';
import { addVar, getVars, getVarByName, updateVar } from '../../services/vars';

const handlers = {
  read: async ctx => {
    try {
      const vars = await getVars();
      ctx.status = 200;
      const body = {
        vars,
      };
      ctx.body = body;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  update: async ctx => {
    const { id, data } = ctx.request.body;

    if (!id && data.name && data.value) {
      // Create new var
      try {
        const { name, value } = data;
        await addVar({
          name,
          value,
        });
        ctx.status = 200;
      } catch (err) {
        console.error(err);
        ctx.status = 500;
      }
    } else {
      // Update existing var
      if (!id || !data || !isObject(data) || !Object.keys(data).length) {
        return (ctx.status = 400);
      }

      try {
        await updateVar(id, data);
        ctx.status = 200;
      } catch (err) {
        console.error(err);
        ctx.status = 500;
      }
    }
  },
};

export default handlers;
