import IScene from '../../typings/scene';
import WorkShiftMessage from '../../controllers/workShift';
import { getEmployeeByChatId } from '../../../services/employees';
import { addWorkShiftActionChecked } from '../../../services/workShiftsActions';
import { getLocationByCoordinates } from '../../../services/locationChecks';
import WorkShiftActionType from '../../../enums/WorkShiftActionType';
import WorkShiftActionDuplicateError from '../../../errors/workShiftActionDuplicate';
import { insertCarRecord } from '../../../services/carRecords';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('openWorkShift/getLocation');

scene.backScene = WorkShiftMessage;
scene.nextScene = WorkShiftMessage;

scene.enter(async (ctx: any) => {
  const keyboard = Markup.keyboard([
    Markup.locationRequestButton('Надіслати місцезнаходження 🗺'),
    Markup.button('⏪ Назад'),
  ])
    .oneTime()
    .resize();

  await ctx.telegram.sendMessage(ctx.from.id, `Щоб підтвердити ваше місцезнаходження на роботі, натисніть "Надіслати місцезнаходження 🗺"` +
    `\n<b>Обов'язково увімкніть GPS</b>`, {
    reply_markup: keyboard,
    parse_mode: 'HTML',
  });
});

scene.on('location', async (ctx: any) => {
  const coordinates = ctx.message.location.latitude + ' ' + ctx.message.location.longitude;

  try {
    const location = await getLocationByCoordinates(coordinates);
    ctx.session.openWorkShift.location = location;
    await openWorkShift(ctx);
    await ctx.reply('Дякуємо, локацію отримали! 👌', Markup.removeKeyboard().extra());
  } catch (err) {
    console.error(err);
    await ctx.reply('Не вдалось отримати локацію.\nСпробуйте пізніше');
    return ctx.scene.reenter();
  }

  await ctx.scene.leave();
  await scene.next(ctx);
});

const openWorkShift = async (ctx) => {
  try {
    const employee = await getEmployeeByChatId(ctx.from.id);
    ctx.session.openWorkShift.employeeId = employee.id;
    await addWorkShiftActionChecked({
      typeId: WorkShiftActionType.OPEN,
      employeeId: employee.id,
      objectId: ctx.session.openWorkShift.objectId,
      car: ctx.session.openWorkShift.car,
      carId: ctx.session.openWorkShift.carId,
      carFee: ctx.session.openWorkShift.carFee || 0,
      location: ctx.session.openWorkShift.location
    });
    if (ctx.session.openWorkShift.carId) {
      await insertCarRecord({
        objectId: ctx.session.openWorkShift.objectId,
        carId: ctx.session.openWorkShift.carId,
        employeeId: employee.id
      })
    }
  } catch (err) {
    console.error(err);
    if (err instanceof WorkShiftActionDuplicateError) {
      await ctx.reply('Ви вже відкрили зміну');
      scene.nextScene = WorkShiftMessage;
    } else {
      await ctx.reply('Не вдалось відкрити зміну.\nСпробуйте пізніше');
      return ctx.scene.reenter();
    }
  }
}

export default scene;
