import IScene from '../../typings/scene';
import HomeMessage from '../../controllers/home';
import { updateEmployee, getEmployeeByChatId } from '../../../services/employees';

const Scene = require('telegraf/scenes/base');

const scene: IScene = new Scene('inspectPersonInfo/editFullName');

scene.backScene = 'inspectPersonInfo/getWhatToEdit';
scene.nextScene = HomeMessage;

scene.enter(async (ctx: any) => {
  await ctx.replyWithHTML('Введіть Ваше <b>ПІБ</b>', scene.backInlineKeyboard.extra());
});

scene.on('text', async (ctx: any) => {
  await ctx.scene.leave();
  const fullName = ctx.message.text;
  try {
    const employee = await getEmployeeByChatId(ctx.from.id);
    await updateEmployee(employee.id, { fullName });
    await scene.next(ctx, 'ПІБ успішно змінено 👌');
  } catch (err) {
    console.error(err);
    await scene.next(ctx, 'Помилка при зміні ПІБ. Спробуйте пізніше');
  }
});

export default scene;
