import IScene from '../../typings/scene';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('registrateEmployee/getPhoneNumber');

scene.backScene = 'registrateEmployee/getBirthDate';
scene.nextScene = 'registrateEmployee/getIdentificationCode';

scene.enter(async (ctx: any) => {
  const keyboard = Markup.keyboard([Markup.contactRequestButton('Надіслати номер 📞'), Markup.button('⏪ Назад')])
    .oneTime()
    .resize();

  await ctx.replyWithHTML(
    'Тепер введіть Ваш <b>номер телефону</b> або натисніть на кнопку "Надіслати номер 📞"',
    keyboard.extra()
  );
});

scene.on('contact', async ctx => {
  await ctx.scene.leave();
  await ctx.reply('Дякуємо, телефон отримали! 👌', Markup.removeKeyboard().extra());
  ctx.session.registrateEmployee.phoneNumber = ctx.message.contact.phone_number;
  await scene.next(ctx);
});

scene.on('text', async (ctx: any) => {
  await ctx.scene.leave();
  await ctx.reply('Дякуємо, телефон отримали! 👌', Markup.removeKeyboard().extra());
  ctx.session.registrateEmployee.phoneNumber = ctx.message.text;
  await scene.next(ctx);
});

export default scene;
