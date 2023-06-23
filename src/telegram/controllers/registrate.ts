import { Markup } from 'telegraf';

const RegistrateMessage = {
  keyboard: Markup.inlineKeyboard([Markup.callbackButton('Зареєструватись ⏩', 'register')]),
  send: async function (ctx, message: string = 'Для того щоб увійти, спершу треба <b>зареєструватись</b>') {
    await ctx.replyWithHTML(message, this.keyboard.extra());
  },
};

export default RegistrateMessage;
