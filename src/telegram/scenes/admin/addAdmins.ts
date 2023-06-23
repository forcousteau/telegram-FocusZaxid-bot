import AdminMessage from '../../controllers/admin';
import { addAdmin } from '../../helpers/functions';
import IScene from '../../typings/scene';

const Scene = require('telegraf/scenes/base');

const scene: IScene = new Scene('addAdmins');

scene.backScene = AdminMessage;
// scene.nextScene = AdminMessage;

// Точка входа в сцену
scene.enter(async (ctx: any) => {
  const keyboard = scene.backInlineKeyboard;
  await ctx.replyWithHTML(
    'Перешлите мне сообщение от будущего админа ⏩\nОн должен быть <b>пользователем бота</b>!',
    keyboard.extra()
  );
});

scene.on('message', async (ctx: any) => {
  await scene.leave(ctx);

  try {
    const adminId = ctx.message.forward_from.id;
    await addAdmin(adminId);

    await ctx.reply('Операция прошла успешно! 🎉', AdminMessage.keyboard);
    console.log(`Новый админ(${adminId}) добавлен! 🎉 Админ: @${ctx.from.username}`);
  } catch (err) {
    await ctx.reply(
      'Не удалось добавить новых админов, приносим извинения.\nВозможно, Вы ввели некорректные данные',
      AdminMessage.keyboard
    );
    console.error(err);
  }

  await scene.next(ctx);
});

export default scene;
