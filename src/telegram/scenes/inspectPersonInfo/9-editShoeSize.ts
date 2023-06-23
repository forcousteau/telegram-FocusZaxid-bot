import IScene from '../../typings/scene';
import HomeMessage from '../../controllers/home';
import { updateEmployee, getEmployeeByChatId } from '../../../services/employees';

const Scene = require('telegraf/scenes/base');

const scene: IScene = new Scene('inspectPersonInfo/editShoeSize');

scene.backScene = 'inspectPersonInfo/getWhatToEdit';
scene.nextScene = HomeMessage;

scene.enter(async (ctx: any) => {
  await ctx.replyWithHTML('Введіть Ваш <b>розмір взуття</b> (число від 36 до 47)', scene.backInlineKeyboard.extra());
});

scene.hears(/^(3[6-9]|4[0-7])$/, async (ctx: any) => {
  await ctx.scene.leave();
  const shoeSize = ctx.match[0];
  try {
    const employee = await getEmployeeByChatId(ctx.from.id);
    await updateEmployee(employee.id, { shoeSize });
    await scene.next(ctx, 'Розмір взуття успішно змінено 👌');
  } catch (err) {
    console.error(err);
    await scene.next(ctx, 'Помилка при зміні розміру взуття. Спробуйте пізніше');
  }
});

scene.on('text', async (ctx: any) => {
  await ctx.replyWithHTML('Ви ввели <b>некоректний</b> розмір взуття.\nСпробуйте знову');
  return ctx.scene.reenter();
});

export default scene;
