import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import path from 'path';
import cors from 'koa2-cors';
import config from 'config';

const STATIC_PATHES = [
  path.join(__dirname, '..', '..', '..', 'admin-panel', 'build'),
  path.join(__dirname, '..', '..', '..', 'public'),
];
const SESSION_CONFIG = {
  key: 'koa.sess',
  maxAge: 1e3 * 60 * 60 * 24 * 14, // 2 weeks
};

const Middlewares = {
  isInit: false,
  init: function (app) {
    if (this.isInit) {
      return;
    }

    this.isInit = true;

    app.use(cors(config.get('server.cors')));

    // Session secret key
    app.keys = [config.get('server.sessionSecret')];

    app.use(session(SESSION_CONFIG, app));
    app.use(bodyParser());
    STATIC_PATHES.forEach(staticPath => app.use(koaStatic(staticPath)));

    console.log('>>> [Server] Middlewares initialized');
  },
};

export default Middlewares;
