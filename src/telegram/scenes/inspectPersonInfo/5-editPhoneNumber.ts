import IScene from '../../typings/scene';
import HomeMessage from '../../controllers/home';
import { updateEmployee, getEmployeeByChatId } from '../../../services/employees';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('inspectPersonInfo/editPhoneNumber');

scene.backScene = 'inspectPersonInfo/getWhatToEdit';
scene.nextScene = HomeMessage;

scene.enter(async (ctx: any) => {
  const keyboard = Markup.keyboard([Markup.contactRequestButton('Надіслати номер 📞'), Markup.button('⏪ Назад')])
    .oneTime()
    .resize();

  await ctx.replyWithHTML(
    'Введіть Ваш <b>номер телефону</b> або натисніть на кнопку "Надіслати номер 📞"',
    keyboard.extra()
  );
});

scene.on('contact', async ctx => {
  await ctx.scene.leave();
  await ctx.reply('Дякуємо, телефон отримали! 👌', Markup.removeKeyboard().extra());
  const phoneNumber = ctx.message.contact.phone_number;
  try {
    const employee = await getEmployeeByChatId(ctx.from.id);
    await updateEmployee(employee.id, { phoneNumber });
    await scene.next(ctx, 'Номер телефону успішно змінено 👌');
  } catch (err) {
    console.error(err);
    await scene.next(ctx, 'Помилка при зміні номера телефону. Спробуйте пізніше');
  }
});

scene.on('text', async (ctx: any) => {
  await ctx.scene.leave();
  await ctx.reply('Дякуємо, телефон отримали! 👌', Markup.removeKeyboard().extra());
  const phoneNumber = ctx.message.text;
  try {
    const employee = await getEmployeeByChatId(ctx.from.id);
    await updateEmployee(employee.id, { phoneNumber });
    await scene.next(ctx, 'Номер телефону успішно змінено 👌');
  } catch (err) {
    console.error(err);
    await scene.next(ctx, 'Помилка при зміні номера телефону. Спробуйте пізніше');
  }
});

export default scene;
