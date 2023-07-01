import IScene from '../../typings/scene';
import WorkShiftMessage from '../../controllers/workShift';
import { getObjectById } from '../../../services/objects';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('closeWorkShift/getBusinessTrip');

scene.backScene = WorkShiftMessage;
scene.nextScene = 'closeWorkShift/getLocation';

scene.enter(async (ctx: any) => {
  const selectedObject = await getObjectById(ctx.session.openWorkShift.objectId);
  if (selectedObject.isDriveCompensated) {
    const keyboard = Markup.inlineKeyboard(
      [
        Markup.callbackButton('Так ✅', 'businessTrip>true'),
        Markup.callbackButton('Ні ❌', 'businessTrip>false'),
        Markup.callbackButton('Назад ⏪', 'back'),
      ],
      { columns: 2 }
    );
    await ctx.telegram.sendMessage(ctx.from.id, 'Ви ночуватимете в готелі?', {
      reply_markup: keyboard,
      parse_mode: 'HTML',
    });
  }else{
    ctx.session.closeWorkShift.businessTrip = false;
    await ctx.scene.leave();
    await scene.next(ctx);
  }
});

scene.action(/^businessTrip>/, async (ctx: any) => {
  ctx.answerCbQuery();
  const businessTrip = ctx.callbackQuery.data.split('>')[1];
  switch (businessTrip) {
    case 'true': {
      ctx.session.closeWorkShift.businessTrip = true;
      break;
    }
    case 'false': {
      ctx.session.closeWorkShift.businessTrip = false;
      break;
    }
    default: {
      await ctx.reply('Не вдалось обрати наявність відрядження.\nСпробуйте пізніше');
      return ctx.scene.reenter();
    }
  }

  await ctx.scene.leave();
  await scene.next(ctx);
});

export default scene;
