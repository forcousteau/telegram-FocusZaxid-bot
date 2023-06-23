import IScene from '../../typings/scene';
import Server from '../../../server';
import HomeMessage from '../../controllers/home';
import { getPositionById } from '../../../services/positions';
import { getClothingSizeById } from '../../../services/clothingSizes';
import { getEmployeeByChatId } from '../../../services/employees';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('inspectPersonInfo/getPersonInfo');

scene.backScene = HomeMessage;
scene.nextScene = 'inspectPersonInfo/getWhatToEdit';

scene.enter(async (ctx: any) => {
  const employee = await getEmployeeByChatId(ctx.from.id);
  const position = await getPositionById(employee.positionId);
  const clothingSize = await getClothingSizeById(employee.clothingSizeId);
  const month =
    employee.birthDate.getMonth().toString().length > 1
      ? employee.birthDate.getMonth() + 1
      : '0' + (employee.birthDate.getMonth() + 1);
  const day =
    employee.birthDate.getDate().toString().length > 1
      ? employee.birthDate.getDate()
      : '0' + employee.birthDate.getDate();
  const message =
    `<b>ПІБ</b>: ${employee.fullName}\n` +
    `<b>День народження</b>: ${day}.${month}.${employee.birthDate.getFullYear()}\n` +
    `<b>Номер телефону</b>: ${employee.phoneNumber}\n` +
    `<b>Посада</b>: ${position.name}\n` +
    `<b>Ставка</b>: ${position.price}\n` +
    `<b>Ідентифікаційний код</b>: ${employee.identificationCode}\n` +
    `<b>Розмір одягу</b>: ${clothingSize.name}\n` +
    `<b>Розмір взуття</b>: ${employee.shoeSize || '-'}\n`;

  const keyboard = Markup.inlineKeyboard([
    [Markup.callbackButton('⏪ Назад', 'back'), Markup.callbackButton('Редагувати ✏️', 'edit')],
  ]);

  if (employee.photoName) {
    try {
      await ctx.replyWithPhoto(encodeURI(Server.getUrl(`img/${employee.photoName}`)), {
        caption: message,
        reply_markup: keyboard,
      });
    } catch (err) {
      console.error(err);
      await ctx.replyWithHTML(message, keyboard.extra());
    }
  } else {
    await ctx.replyWithHTML(message, keyboard.extra());
  }
});

scene.action('edit', async (ctx: any) => {
  ctx.answerCbQuery();
  await ctx.scene.leave();
  await scene.next(ctx);
});

export default scene;
