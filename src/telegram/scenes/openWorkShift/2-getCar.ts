import IScene from '../../typings/scene';
import { getObjectById } from '../../../services/objects';
import { getVarByName } from '../../../services/vars';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('openWorkShift/getCar');

scene.backScene = 'openWorkShift/getRegion';
scene.nextScene = 'openWorkShift/getLocation';

scene.enter(async (ctx: any) => {
  const selectedObject = await getObjectById(ctx.session.openWorkShift.objectId);
  if(selectedObject.isDriveCompensated){
    ctx.session.distanceToObject = selectedObject.distanceInKM;
    const keyboard = Markup.inlineKeyboard(
        [
          Markup.callbackButton('Так ✅', 'lviv>true'),
          Markup.callbackButton('Ні ❌', 'lviv>false'),
          Markup.callbackButton('Назад ⏪', 'back'),
        ],
        { columns: 2 }
      );
    
      await ctx.telegram.sendMessage(ctx.from.id, 'Ви сьогодні виїжджали зі Львова?', {
        reply_markup: keyboard,
        parse_mode: 'HTML',
      });
  } else {
    scene.nextScene = 'openWorkShift/getLocation';
    await ctx.scene.leave();
    await scene.next(ctx);
  }
});

scene.action(/^lviv>/, async (ctx: any) => {
  const pricePerKM = await getVarByName('pricePerKM');
  ctx.answerCbQuery();
  const lviv = ctx.callbackQuery.data.split('>')[1];
  switch (lviv) {
    case 'true': {
      ctx.session.openWorkShift.car = true;
      ctx.session.openWorkShift.carFee = Number(pricePerKM.value) * ctx.session.distanceToObject;
      scene.nextScene = 'openWorkShift/getCarRecord';
      break;
    }
    case 'false': {
      scene.nextScene = 'openWorkShift/getLocation';
      ctx.session.openWorkShift.car = false;
      break;
    }
    default: {
      await ctx.reply('Не вдалось обрати.\nСпробуйте пізніше');
      return ctx.scene.reenter();
    }
  }

  await ctx.scene.leave();
  await scene.next(ctx);
});


export default scene;
