import { startLocationCheck, getLocationChecks } from '../../services/locationChecks';

const handlers = {
  create: async ctx => {
    try {
      await startLocationCheck();
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  read: async ctx => {
    try {
      const locationChecks = await getLocationChecks();
      ctx.status = 200;
      const body = {
        locationChecks,
      };
      ctx.body = body;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
