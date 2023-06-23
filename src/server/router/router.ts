import KoaRouter from '@koa/router';
import routes from './routes';

const Router = {
  router: null,
  init: function (app) {
    if (this.router) {
      return;
    }

    this.router = new KoaRouter();

    routes.init(this.router);

    app.use(this.router.routes());

    console.log('>>> [Server] Router initialized');
  },
};

export default Router;
