import {
  addRegistrationCode,
  getRegistrationCodes,
  deleteRegistrationCodes,
  addRegistrationCodes,
} from '../../services/registrationCodes';

const handlers = {
  create: async ctx => {
    const { codes } = ctx.request.body;

    if (!codes.length) {
      return (ctx.status = 400);
    }

    try {
      await addRegistrationCodes(codes);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  read: async ctx => {
    try {
      const registrationCodes = await getRegistrationCodes();
      ctx.status = 200;
      const body = {
        registrationCodes,
      };
      ctx.body = body;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  delete: async ctx => {
    const { codes } = ctx.request.body;

    if (!codes || !Array.isArray(codes)) {
      return (ctx.status = 400);
    }

    try {
      await deleteRegistrationCodes(codes);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
