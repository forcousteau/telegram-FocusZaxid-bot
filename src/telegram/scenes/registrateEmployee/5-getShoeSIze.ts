import IScene from '../../typings/scene';

const Scene = require('telegraf/scenes/base');

const scene: IScene = new Scene('registrateEmployee/getShoeSize');

scene.backScene = 'registrateEmployee/getIdentificationCode';
scene.nextScene = 'registrateEmployee/getClothingSize';

scene.enter(async (ctx: any) => {
  await ctx.replyWithHTML('Введіть Ваш <b>розмір взуття</b> (число від 36 до 47)', scene.backInlineKeyboard.extra());
});

scene.hears(/^(3[6-9]|4[0-7])$/, async (ctx: any) => {
  await ctx.scene.leave();
  ctx.session.registrateEmployee.shoeSize = ctx.match[0];
  await scene.next(ctx);
});

scene.on('text', async (ctx: any) => {
  await ctx.replyWithHTML('Ви ввели <b>некоректний</b> розмір взуття.\nСпробуйте знову');
  return ctx.scene.reenter();
});

export default scene;
