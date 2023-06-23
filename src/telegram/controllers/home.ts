import { Markup } from 'telegraf';

const HomeMessage = {
  keyboard: Markup.inlineKeyboard(
    [
      Markup.callbackButton('Поточна зміна 📝', 'workShift'),
      Markup.callbackButton('Персональні дані ℹ️', 'userInfo'),
      Markup.callbackButton('Завантажити звіт 📚', 'monthReport'),
      Markup.callbackButton('Залишити примітку ✏️', 'leaveAppeal'),
    ],
    { columns: 1 }
  ),
  send: async function (ctx, message: string = 'Що Ви бажаєте зробити?') {
    await ctx.replyWithHTML(message, this.keyboard.extra());
  },
};

export default HomeMessage;
