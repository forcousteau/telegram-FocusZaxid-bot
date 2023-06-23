import IScene from '../../typings/scene';
import WorkShiftMessage from '../../controllers/workShift';
import WorkShiftActionType from '../../../enums/WorkShiftActionType';
import { getEmployeeByChatId } from '../../../services/employees';
import { addWorkShiftActionChecked } from '../../../services/workShiftsActions';
import WorkShiftActionDuplicateError from '../../../errors/workShiftActionDuplicate';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('closeWorkShift/getCar');

scene.backScene = WorkShiftMessage;
scene.nextScene = 'closeWorkShift/getLocation';

scene.enter(async (ctx: any) => {
  const keyboard = Markup.inlineKeyboard(
    [
      Markup.callbackButton('Так 🚘', 'car>true'),
      Markup.callbackButton('Ні ❌', 'car>false'),
      Markup.callbackButton('Назад ⏪', 'back'),
    ],
    { columns: 2 }
  );
  await ctx.replyWithHTML('Підтвердіть наявність <b>машини</b>', keyboard.extra());
});

scene.action(/^car>/, async (ctx: any) => {
  ctx.answerCbQuery();
  const car = ctx.callbackQuery.data.split('>')[1];
  switch (car) {
    case 'true': {
      ctx.session.closeWorkShift.car = true;
      break;
    }
    case 'false': {
      ctx.session.closeWorkShift.car = false;
      break;
    }
    default: {
      await ctx.reply('Не вдалось обрати наявність відрядження.\nСпробуйте пізніше');
      return ctx.scene.reenter();
    }
  }

  try {
    const employee = await getEmployeeByChatId(ctx.from.id);
    const workShiftAction = await addWorkShiftActionChecked({
      typeId: WorkShiftActionType.CLOSE,
      employeeId: employee.id,
      objectId: ctx.session.closeWorkShift.objectId,
      car: ctx.session.closeWorkShift.car,
      businessTrip: ctx.session.closeWorkShift.businessTrip,
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

  await ctx.scene.leave();
  await scene.next(ctx);
});

export default scene;
