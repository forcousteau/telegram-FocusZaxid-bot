import RedisSession from 'telegraf-session-redis';
import config from 'config';

const middleware = new RedisSession({
  store: config.get<{
    host: string;
    port: number;
  }>('telegramBot.sessionRedisStore'),
  getSessionKey: ctx => `${ctx.from.id}:${ctx.from.id}`,
});

export default middleware;
