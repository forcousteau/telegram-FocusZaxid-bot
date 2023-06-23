import { isObject } from '../../services/functions';
import {
  addWebadmin,
  getWebadminsForAdminPanel,
  updateWebadmin,
  updatePassword,
  deleteWebadmins,
} from '../../services/webadmins';

const handlers = {
  create: async ctx => {
    const { username, password, roleId } = ctx.request.body;

    if (!username || !password || !roleId) {
      return (ctx.status = 400);
    }

    try {
      await addWebadmin(username, password, roleId);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  read: async ctx => {
    try {
      const webadmins = await getWebadminsForAdminPanel();
      ctx.status = 200;
      const body = {
        webadmins,
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
      if (data.password) {
        await updatePassword(id, data.password);
        delete data.password;
      }

      if (Object.keys(data).length) {
        await updateWebadmin(id, data);
      }

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
      await deleteWebadmins(ids);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
