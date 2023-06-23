import IScene from '../../typings/scene';
import RegistrateMessage from '../../controllers/registrate';

const Scene = require('telegraf/scenes/base');

const scene: IScene = new Scene('registrateEmployee/getFullName');

scene.backScene = RegistrateMessage;
scene.nextScene = 'registrateEmployee/getBirthDate';

scene.enter(async (ctx: any) => {
  ctx.session.registrateEmployee = {};
  await ctx.replyWithHTML('Введіть Ваше <b>ПІБ</b>', scene.backInlineKeyboard.extra());
});

scene.on('text', async (ctx: any) => {
  await ctx.scene.leave();
  ctx.session.registrateEmployee.fullName = ctx.message.text;
  await scene.next(ctx);
});

export default scene;
