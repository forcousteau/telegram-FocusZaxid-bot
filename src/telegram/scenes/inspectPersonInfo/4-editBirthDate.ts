import IScene from '../../typings/scene';
import HomeMessage from '../../controllers/home';
import { updateEmployee, getEmployeeByChatId } from '../../../services/employees';

const Scene = require('telegraf/scenes/base');

const scene: IScene = new Scene('inspectPersonInfo/editBirthDate');

scene.backScene = 'inspectPersonInfo/getWhatToEdit';
scene.nextScene = HomeMessage;

const DATE_REGEXP = /^(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.]\d{4}$/g;

scene.enter(async (ctx: any) => {
  const text = 'Введіть Вашу <b>дату народження</b> у форматі 12.12.1992';
  await ctx.replyWithHTML(text, scene.backInlineKeyboard.extra());
});

scene.hears(DATE_REGEXP, async (ctx: any) => {
  await ctx.scene.leave();
  const dates = ctx.message.text.match(/\d{4}|\d{2}/g);
  const birthDate = new Date(0);

  birthDate.setUTCFullYear(dates[2]);
  birthDate.setUTCMonth(dates[1] - 1);
  birthDate.setUTCDate(dates[0]);

  try {
    const employee = await getEmployeeByChatId(ctx.from.id);
    await updateEmployee(employee.id, { birthDate });
    await scene.next(ctx, 'Дату народження успішно змінено 👌');
  } catch (err) {
    console.error(err);
    await scene.next(ctx, 'Помилка при зміні дати народження. Спробуйте пізніше');
  }
});

scene.on('text', async (ctx: any) => {
  await ctx.replyWithHTML('Щось не дуже схоже на дату народження 🤔\nСпробуйте знову');
});

export default scene;
