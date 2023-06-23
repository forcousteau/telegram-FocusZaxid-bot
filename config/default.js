const path = require('path');

module.exports = {
  db: {
    user: '<USER>',
    host: '<HOST>',
    database: '<DATABASE>',
    password: '<PASSWORD>',
    port: 5432,
  },
  telegramBot: {
    token: '<TELEGRAM_BOT_TOKEN>',
    webhook: {
      useWebhook: false,
      secretPath: '/secret',
      port: 3000,
      tlsOptions: null,
    },
    sessionRedisStore: {
      host: '<HOST>',
      port: 6379,
    },
  },
  server: {
    host: 'localhost',
    httpPort: 80,
    imagePath: path.join(__dirname, '..', 'public', 'img'),
    sessionSecret: 'secret',
    cors: {
      origins: ['http://localhost:3000', 'https://localhost:3000'],
      credentials: true,
    },
  },
  locationIQ: {
    key: '<LOCATION_IQ_KEY>',
  },
};
