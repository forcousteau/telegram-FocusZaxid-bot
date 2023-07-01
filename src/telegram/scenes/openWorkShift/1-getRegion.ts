import IScene from '../../typings/scene';
import WorkShiftMessage from '../../controllers/workShift';
import { getActiveRegions } from '../../../services/regions';
import { getInlineKeyboardWithBackButton } from '../../helpers/keyboards';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('openWorkShift/getRegion');

scene.backScene = WorkShiftMessage;
scene.nextScene = 'openWorkShift/getCar';

scene.enter(async (ctx: any) => {
  ctx.session.openWorkShift = {};

  const regions = await getActiveRegions();
  const buttons = regions.map(region => {
    return Markup.switchToCurrentChatButton(region.name, 'regionId>open>' + region.id);
  });
  const keyboard = await getInlineKeyboardWithBackButton(buttons, 2);

  await ctx.replyWithHTML("Тепер оберіть <b>об'єкт</b>", keyboard.extra());
});

export default scene;
