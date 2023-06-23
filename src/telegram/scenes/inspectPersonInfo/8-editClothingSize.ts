import IScene from '../../typings/scene';
import HomeMessage from '../../controllers/home';
import { updateEmployee, getEmployeeByChatId } from '../../../services/employees';
import { getClothingSizes } from '../../../services/clothingSizes';
import { getInlineKeyboardWithBackButton } from '../../helpers/keyboards';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('inspectPersonInfo/editClothingSize');

scene.backScene = 'inspectPersonInfo/getWhatToEdit';
scene.nextScene = HomeMessage;

scene.enter(async (ctx: any) => {
  const clothingSizes = await getClothingSizes();

  const buttons = clothingSizes.map(clothingSize => {
    return Markup.callbackButton(clothingSize.name, `clothingSize>${clothingSize.id}`);
  });

  const keyboard = await getInlineKeyboardWithBackButton(buttons, 2);
  await ctx.replyWithHTML('Оберіть Ваш <b>розмір одягу</b>', keyboard.extra());
});

scene.action(/^clothingSize>/, async (ctx: any) => {
  ctx.answerCbQuery();
  const clothingSizeId = ctx.callbackQuery.data.split('>')[1];
  try {
    const employee = await getEmployeeByChatId(ctx.from.id);
    await updateEmployee(employee.id, { clothingSizeId });
    await scene.next(ctx, 'Розмір одягу успішно змінено 👌');
  } catch (err) {
    console.error(err);
    await scene.next(ctx, 'Помилка при зміні розміру одягу. Спробуйте пізніше');
  }
});

export default scene;
