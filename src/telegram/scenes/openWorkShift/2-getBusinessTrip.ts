import IScene from '../../typings/scene';
import WorkShiftActionType from '../../../enums/WorkShiftActionType';
import { getEmployeeByChatId } from '../../../services/employees';
import { addWorkShiftActionChecked } from '../../../services/workShiftsActions';
import WorkShiftActionDuplicateError from '../../../errors/workShiftActionDuplicate';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('openWorkShift/getBusinessTrip');

scene.backScene = 'openWorkShift/getRegion';
scene.nextScene = 'openWorkShift/getLocation';

scene.enter(async (ctx: any) => {
  const keyboard = Markup.inlineKeyboard(
    [
      Markup.callbackButton('Так 🚝', 'businessTrip>true'),
      Markup.callbackButton('Ні ❌', 'businessTrip>false'),
      Markup.callbackButton('Назад ⏪', 'back'),
    ],
    { columns: 2 }
  );
  await ctx.telegram.sendMessage(ctx.from.id, 'Підтвердіть наявність <b>відрядження</b>', {
    reply_markup: keyboard,
    parse_mode: 'HTML',
  });
});

scene.action(/^businessTrip>/, async (ctx: any) => {
  ctx.answerCbQuery();
  const businessTrip = ctx.callbackQuery.data.split('>')[1];
  switch (businessTrip) {
    case 'true': {
      ctx.session.openWorkShift.businessTrip = true;
      break;
    }
    case 'false': {
      ctx.session.openWorkShift.businessTrip = false;
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
      typeId: WorkShiftActionType.OPEN,
      employeeId: employee.id,
      objectId: ctx.session.openWorkShift.objectId,
      businessTrip: ctx.session.openWorkShift.businessTrip,
    });
    ctx.session.openWorkShift.workShiftActionId = workShiftAction.id;
  } catch (err) {
    console.error(err);
    if (err instanceof WorkShiftActionDuplicateError) {
      await ctx.reply('Ви вже відкрили зміну');
    } else {
      await ctx.reply('Не вдалось відкрити зміну.\nСпробуйте пізніше');
      return ctx.scene.reenter();
    }
  }

  await ctx.scene.leave();
  await scene.next(ctx);
});

export default scene;
