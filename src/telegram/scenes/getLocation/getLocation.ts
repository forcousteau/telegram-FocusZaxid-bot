import IScene from '../../typings/scene';
import WorkingMessage from '../../controllers/working';
import HomeMessage from '../../controllers/home';
import { addGeocodingRequest } from '../../../services/locationChecks';
import { getEmployeeByChatId } from '../../../services/employees';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('getLocation');

scene.backScene = async ctx => {
  await ctx.scene.leave();
  await WorkingMessage.send(ctx.from.id, ctx.session.locationCheckId);
};

scene.nextScene = HomeMessage;

scene.enter(async (ctx: any) => {
  const keyboard = Markup.keyboard([
    Markup.locationRequestButton('Надіслати місцезнаходження 🗺'),
    Markup.button('⏪ Назад'),
  ])
    .oneTime()
    .resize();

  await ctx.replyWithHTML(
    `Щоб підтвердити ваше місцезнаходження на роботі, натисніть "Надіслати місцезнаходження 🗺"` +
      `\n<b>Обов'язково увімкніть GPS</b>`,
    keyboard.extra()
  );
});

scene.on('location', async (ctx: any) => {
  await ctx.scene.leave();
  const employee = await getEmployeeByChatId(ctx.from.id);
  const location = ctx.message.location.latitude + ' ' + ctx.message.location.longitude;

  try {
    await addGeocodingRequest({
      locationCheckId: ctx.session.locationCheckId,
      employeeId: employee.id,
      coordinates: location,
    });
    await ctx.reply('Дякуємо, локацію отримали! 👌', Markup.removeKeyboard().extra());
  } catch (err) {
    console.error(err);
    await ctx.reply('Не вдалось отримати локацію.\nСпробуйте пізніше');
  }

  await scene.next(ctx);
});

export default scene;
