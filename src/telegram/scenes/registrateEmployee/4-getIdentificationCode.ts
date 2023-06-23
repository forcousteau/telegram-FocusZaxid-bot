import IScene from '../../typings/scene';

const Scene = require('telegraf/scenes/base');

const scene: IScene = new Scene('registrateEmployee/getIdentificationCode');

scene.backScene = 'registrateEmployee/getPhoneNumber';
scene.nextScene = 'registrateEmployee/getShoeSize';

scene.enter(async (ctx: any) => {
  await ctx.replyWithHTML('Введіть Ваш <b>ідентифікаційний код</b>', scene.backInlineKeyboard.extra());
});

scene.on('text', async (ctx: any) => {
  await ctx.scene.leave();
  ctx.session.registrateEmployee.identificationCode = ctx.message.text;
  await scene.next(ctx);
});

export default scene;
