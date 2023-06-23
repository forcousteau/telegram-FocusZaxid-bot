import { Markup } from 'telegraf';
import { sendGlobal } from '../../helpers/functions';
import AdminMessage from '../../controllers/admin';
import Scene from 'telegraf/scenes/base';
import IScene from '../../typings/scene';

const scene: IScene = new Scene('gsend');

scene.backScene = AdminMessage;
// scene.nextScene = AdminMessage;

// Точка входа в сцену
scene.enter(async ctx => {
  const keyboard = scene.backInlineKeyboard;
  await ctx.replyWithHTML('Введите <b>сообщение</b> для рассылки', keyboard.extra());
});

scene.on('text', async ctx => {
  await scene.leave(ctx);

  try {
    await sendGlobal(ctx, ctx.message);
    await ctx.reply('Рассылка успешно проведена! 🎉', AdminMessage.keyboard);
    console.log(`Рассылка успешно проведена! 🎉 Админ: @${ctx.from.username}; Сообщение: "${ctx.message.text}"`);
  } catch (err) {
    await ctx.reply('Не удалось выполнить рассылку, приносим извинения', AdminMessage.keyboard);
    console.error(err);
  }

  await scene.next(ctx);
});

export default scene;
