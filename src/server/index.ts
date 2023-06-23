import fs from 'fs';
import util from 'util';
import http from 'http';
import Koa from 'koa';
import middlewares from './middlewares/middlewares';
import router from './router/router';
import config from 'config';

const Server = {
  app: null,
  httpURL: null,
  getUrl: function (path) {
    return this.httpURL + '/' + path;
  },
  init: async function () {
    // Singletone method
    if (this.app) {
      return;
    }

    this.app = new Koa();

    middlewares.init(this.app);
    router.init(this.app);

    // Http server
    const httpServer = http.createServer(this.app.callback());

    this.httpURL = `http://${config.get('server.host')}:${config.get('server.httpPort')}`;

    try {
      //@ts-ignore
      await util.promisify(httpServer.listen).call(httpServer, config.get('server.httpPort'));
      console.log(`>>> Server started at ${this.httpURL}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  },
};

export default Server;
