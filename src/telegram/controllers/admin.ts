import { Markup } from 'telegraf';

const AdminMessage = {
  keyboard: Markup.keyboard([
    ['Рассылка 📡', 'Статистика 📊'],
    ['Добавить админа 👔', 'Список админов 📃'],
  ])
    .oneTime()
    .resize()
    .extra(),

  send: async (ctx, message: string = 'Добро пожаловать в админ-панель!') => {
    await ctx.reply(message, AdminMessage.keyboard);
  },
};

export default AdminMessage;
