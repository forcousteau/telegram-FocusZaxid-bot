import path from 'path';
import send from 'koa-send';
import { checkPassword } from '../../services/webadmins';
import { getWebadminRoleByUsername } from '../../services/webadminsRoles';

const STATIC_PATH = path.join(__dirname, '..', '..', '..', 'admin-panel', 'build');

const handlers = {
  auth: {
    check: async ctx => {
      const webadminRole = ctx.session.username ? await getWebadminRoleByUsername(ctx.session.username) : null;

      ctx.body = Object.assign({ login: !!ctx.session.isAuth }, webadminRole ? { webadminRole } : null);
    },
    login: async ctx => {
      const { username, password } = ctx.request.body;
      if (!username || !password) {
        return (ctx.status = 400);
      }
      try {
        const valid = await checkPassword(username, password);
        const webadminRole = await getWebadminRoleByUsername(username);

        ctx.session = {
          username,
          isAuth: valid,
        };

        ctx.status = 200;
        ctx.body = Object.assign({ login: valid }, webadminRole ? { webadminRole } : null);
      } catch (err) {
        console.error(err);
        ctx.status = 500;
      }
    },
    logout: async ctx => {
      ctx.session.isAuth = false;
      ctx.status = 200;
    },
  },
  panel: {
    main: async ctx => {
      ctx.status = 200;
      await send(ctx, 'index.html', { root: STATIC_PATH });
    },
  },
};

export default handlers;
