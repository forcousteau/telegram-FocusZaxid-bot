import { Markup } from 'telegraf';

const FiredMessage = {
  keyboard: Markup.inlineKeyboard([Markup.callbackButton('Спробувати знову ⏩', 'home')]),
  send: async function (ctx, message: string = 'Ви були звільнені. Для надання доступу зверніться до адміністратора') {
    await ctx.replyWithHTML(message, this.keyboard.extra());
  },
};

export default FiredMessage;
