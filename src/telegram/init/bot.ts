import Telegraf from 'telegraf';
import config from 'config';

const Bot = {
  token: config.get<string>('telegramBot.token'),
  configure: async () => {
    const bot = new Telegraf(Bot.token);
    if (config.get<boolean>('telegramBot.webhook.useWebhook')) {
      bot.startWebhook(
        config.get<string>('telegramBot.webhook.secretPath'),
        config.get<Object>('telegramBot.webhook.tlsOptions'),
        config.get<number>('telegramBot.webhook.port')
      );
    }

    bot.catch(err => {
      console.error(err);
    });

    await bot.launch();

    console.log('>>> [Telegram] Bot configured');
    return bot;
  },
};

export default Bot;
