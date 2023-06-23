import IScene from '../../typings/scene';
import HomeMessage from '../../controllers/home';
import { addAppeal } from '../../../services/appeals';
import { getEmployeeByChatId } from '../../../services/employees';

const Scene = require('telegraf/scenes/base');

const scene: IScene = new Scene('leaveAppeal/getText');

scene.backScene = HomeMessage;
scene.nextScene = HomeMessage;

scene.enter(async (ctx: any) => {
  ctx.session.appeal = {};
  await ctx.replyWithHTML('Введіть <b>текст</b> примітки', scene.backInlineKeyboard.extra());
});

scene.on('text', async (ctx: any) => {
  await ctx.scene.leave();
  ctx.session.appeal.message = ctx.message.text;

  try {
    const { id: employeeId } = await getEmployeeByChatId(ctx.from.id);
    await addAppeal({
      employeeId,
      ...ctx.session.appeal,
    });

    return scene.next(ctx, 'Примітку успішно додано 👌');
  } catch (err) {
    console.error(err);

    return scene.next(ctx, 'Хмм, щось пішло не так 😢\nСпробуйте трохи пізніше або зверніться до підтримки');
  }
});

export default scene;
