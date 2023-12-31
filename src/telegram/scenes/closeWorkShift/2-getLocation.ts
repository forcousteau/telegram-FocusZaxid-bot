import IScene from '../../typings/scene';
import WorkShiftMessage from '../../controllers/workShift';
import { addWorkShiftActionChecked } from '../../../services/workShiftsActions';
import { getLocationByCoordinates } from '../../../services/locationChecks';
import { getEmployeeByChatId } from '../../../services/employees';
import WorkShiftActionType from '../../../enums/WorkShiftActionType';
import WorkShiftActionDuplicateError from '../../../errors/workShiftActionDuplicate';

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
    ctx.session.closeWorkShift.location = location;
    await handleCloseWorkShift(ctx);
    await ctx.reply('Дякуємо, локацію отримали! 👌', Markup.removeKeyboard().extra());
  } catch (err) {
    console.error(err);
    await ctx.reply('Не вдалось отримати локацію.\nСпробуйте пізніше');
    return ctx.scene.reenter();
  }

  await ctx.scene.leave();
  await scene.next(ctx);
});

const handleCloseWorkShift = async (ctx) =>{
  try {
    const employee = await getEmployeeByChatId(ctx.from.id);
    const workShiftAction = await addWorkShiftActionChecked({
      typeId: WorkShiftActionType.CLOSE,
      employeeId: employee.id,
      objectId: ctx.session.closeWorkShift.objectId,
      businessTrip: ctx.session.closeWorkShift.businessTrip,
      location: ctx.session.openWorkShift.location
    });
    ctx.session.closeWorkShift.workShiftActionId = workShiftAction.id;
  } catch (err) {
    console.error(err);
    if (err instanceof WorkShiftActionDuplicateError) {
      await ctx.reply('Ви вже закрили зміну');
    } else {
      await ctx.reply('Не вдалось закрити зміну.\nСпробуйте пізніше');
      return ctx.scene.reenter();
    }
  }
}

export default scene;
