import { Markup } from 'telegraf';
import Telegram from '../../telegram/';

const WorkingMessage = {
  send: async function (chatId, locationCheckId, message: string = 'Ви сьогодні працюєте?') {
    const keyboard = Markup.inlineKeyboard([
      Markup.callbackButton('Ні', 'working>false>' + locationCheckId),
      Markup.callbackButton('Так', 'working>true>' + locationCheckId),
    ]);
    const bot = await Telegram.getBot();
    await bot.telegram.sendMessage(chatId, message, keyboard.extra());
  },
};

export default WorkingMessage;
