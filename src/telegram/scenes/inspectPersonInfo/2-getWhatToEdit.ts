import IScene from '../../typings/scene';
import HomeMessage from '../../controllers/home';
import { getInlineKeyboardWithBackButton } from '../../helpers/keyboards';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('inspectPersonInfo/getWhatToEdit');

scene.backScene = 'inspectPersonInfo/getPersonInfo';

scene.enter(async (ctx: any) => {
  const buttons = [
    Markup.callbackButton('Фотографію', 'editPhoto'),
    Markup.callbackButton('ПІБ', 'editFullName'),
    Markup.callbackButton('Дату народження', 'editBirthDate'),
    Markup.callbackButton('Номер телефону', 'editPhoneNumber'),
    Markup.callbackButton('Ідентифікаційний код', 'editIdentificationCode'),
    Markup.callbackButton('Розмір одягу', 'editClothingSize'),
    Markup.callbackButton('Розмір взуття', 'editShoeSize'),
  ];

  const keyboard = await getInlineKeyboardWithBackButton(buttons, 2);
  await ctx.replyWithHTML('Що ви хочете <b>відредагувати</b>?', keyboard.extra());
});

scene.action(
  /^editPhoto$|^editFullName$|^editBirthDate$|^editPhoneNumber$|^editIdentificationCode$|^editClothingSize$|^editShoeSize$/,
  async ctx => {
    ctx.answerCbQuery();
    await ctx.scene.leave();
    await scene.checkInInlineKeyboard(ctx, ctx.callbackQuery.data);
    scene.nextScene = `inspectPersonInfo/${ctx.match[0]}`;
    await scene.next(ctx);
  }
);

export default scene;
