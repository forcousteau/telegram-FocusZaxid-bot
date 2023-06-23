import IScene from '../../typings/scene';
import WorkShiftMessage from '../../controllers/workShift';
import { updateWorkShiftAction } from '../../../services/workShiftsActions';
import { getLocationByCoordinates } from '../../../services/locationChecks';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('closeWorkShift/getLocation');

scene.backScene = WorkShiftMessage;
scene.nextScene = WorkShiftMessage;

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
  const coordinates = ctx.message.location.latitude + ' ' + ctx.message.location.longitude;

  try {
    const location = await getLocationByCoordinates(coordinates);
    await updateWorkShiftAction(ctx.session.closeWorkShift.workShiftActionId, { location });
    await ctx.reply('Дякуємо, локацію отримали! 👌', Markup.removeKeyboard().extra());
  } catch (err) {
    console.error(err);
    await ctx.reply('Не вдалось отримати локацію.\nСпробуйте пізніше');
    return ctx.scene.reenter();
  }

  await ctx.scene.leave();
  await scene.next(ctx);
});

export default scene;
