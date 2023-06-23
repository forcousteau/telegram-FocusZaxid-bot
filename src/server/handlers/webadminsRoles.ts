import { isObject } from '../../services/functions';
import { getWebadminsRoles } from '../../services/webadminsRoles';

const handlers = {
  read: async ctx => {
    try {
      const webadminsRoles = await getWebadminsRoles();
      ctx.status = 200;
      const body = {
        webadminsRoles,
      };
      ctx.body = body;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
