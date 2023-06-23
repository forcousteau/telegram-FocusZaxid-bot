import upload from '../libs/multer';

const handlers = {
  create: async ctx => {
    try {
      const data = await upload(ctx);
      const { file } = data;

      if (!file?.filename) {
        return (ctx.status = 400);
      } else {
        ctx.status = 200;
        ctx.body = {
          filename: file?.filename,
        };
      }
    } catch (err) {
      console.error(err);
      return (ctx.status = 400);
    }
  },
};

export default handlers;
