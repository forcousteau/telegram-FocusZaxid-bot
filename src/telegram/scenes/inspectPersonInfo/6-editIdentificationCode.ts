import IScene from '../../typings/scene';
import HomeMessage from '../../controllers/home';
import { updateEmployee, getEmployeeByChatId } from '../../../services/employees';

const Scene = require('telegraf/scenes/base');

const scene: IScene = new Scene('inspectPersonInfo/editIdentificationCode');

scene.backScene = 'inspectPersonInfo/getWhatToEdit';
scene.nextScene = HomeMessage;

scene.enter(async (ctx: any) => {
  await ctx.replyWithHTML('Введіть Ваш <b>ідентифікаційний код</b>', scene.backInlineKeyboard.extra());
});

scene.on('text', async (ctx: any) => {
  await ctx.scene.leave();
  const identificationCode = ctx.message.text;
  try {
    const employee = await getEmployeeByChatId(ctx.from.id);
    await updateEmployee(employee.id, { identificationCode });
    await scene.next(ctx, 'Ідентифікаційний код успішно змінено 👌');
  } catch (err) {
    console.error(err);
    await scene.next(ctx, 'Помилка при зміні ідентифікаційного коду. Спробуйте пізніше');
  }
});

export default scene;
