import { Markup, Stage } from 'telegraf';
import AdminMessage from '../controllers/admin';
import StatsMessage from '../controllers/stats';
import { getAdmins, isAdmin, dismissAdmin } from '../helpers/functions';

const AdminHandlers = {
  init: bot => {
    bot.command('admin', async ctx => {
      if (await isAdmin(ctx.from.id)) {
        await AdminMessage.send(ctx);
      }
    });

    bot.hears('Рассылка 📡', async (ctx: any) => {
      if (await isAdmin(ctx.from.id)) {
        await ctx.scene.enter('gsend');
      }
    });

    bot.hears('Статистика 📊', async ctx => {
      if (await isAdmin(ctx.from.id)) {
        await StatsMessage.send(ctx);
      }
    });

    bot.hears('Добавить админа 👔', async ctx => {
      if (await isAdmin(ctx.from.id)) {
        await ctx.scene.enter('addAdmins');
      }
    });

    bot.hears('Список админов 📃', async ctx => {
      if (await isAdmin(ctx.from.id)) {
        const admins = await getAdmins();

        for (const admin of admins) {
          const name = admin.name;
          const chatId = admin.chatId;
          const username = admin.username !== undefined ? admin.username : 'не указано';

          let keyboard = Markup.inlineKeyboard([Markup.callbackButton('Отстранить ❌ ', `dismiss>${chatId}`)]).extra();

          await ctx.replyWithHTML(
            `<b>Имя</b>: ${name}\n<b>Юзернейм</b>: @${username}\n<b>ChatId</b>: ${chatId}`,
            keyboard
          );
        }
        await AdminMessage.send(ctx);
      }
    });

    bot.action(/^dismiss>[0-9]+$/, async ctx => {
      if (await isAdmin(ctx.from.id)) {
        try {
          await dismissAdmin(+ctx.callbackQuery.data.split('>')[1]);
          await ctx.answerCbQuery();
          await ctx.reply('Админ успешно отстранён ✔️', AdminMessage.keyboard);
        } catch (err) {
          console.error(err);
          await ctx.answerCbQuery();
          await ctx.reply('Не удалось отстранить админа, приносим извинения', AdminMessage.keyboard);
        }
      }
    });
  },
};

export default AdminHandlers;
