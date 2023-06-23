import IScene from '../../typings/scene';
import RegistrateMessage from '../../controllers/registrate';
import HomeMessage from '../../controllers/home';
import { getClothingSizes } from '../../../services/clothingSizes';
import { addEmployee } from '../../../services/employees';
import { getInlineKeyboardWithBackButton } from '../../helpers/keyboards';

const Scene = require('telegraf/scenes/base');
const Markup = require('telegraf/markup');

const scene: IScene = new Scene('registrateEmployee/getClothingSize');

scene.backScene = 'registrateEmployee/getShoeSize';
scene.nextScene = HomeMessage;

scene.enter(async (ctx: any) => {
  let clothingSizes;
  try {
    clothingSizes = await getClothingSizes();
  } catch (err) {
    console.error(err);
    return RegistrateMessage.send(
      ctx,
      'Хмм, щось пішло не так 😢' + '\nСпробуйте трохи пізніше або зверніться до підтримки'
    );
  }

  const buttons = clothingSizes.map(clothingSize => {
    return Markup.callbackButton(clothingSize.name, `clothingSize>${clothingSize.id}`);
  });

  const keyboard = await getInlineKeyboardWithBackButton(buttons, 2);
  await ctx.replyWithHTML('Оберіть Ваш <b>розмір одягу</b>', keyboard.extra());
});

scene.action(/^clothingSize>/, async (ctx: any) => {
  ctx.answerCbQuery();
  ctx.session.registrateEmployee.clothingSize = ctx.callbackQuery.data.split('>')[1];
  await scene.checkInInlineKeyboard(ctx, ctx.callbackQuery.data);
  try {
    await addEmployee({
      chatId: ctx.from.id,
      fullName: ctx.session.registrateEmployee.fullName,
      birthDate: ctx.session.registrateEmployee.birthDate,
      phoneNumber: ctx.session.registrateEmployee.phoneNumber,
      identificationCode: ctx.session.registrateEmployee.identificationCode,
      shoeSize: ctx.session.registrateEmployee.shoeSize,
      clothingSizeId: ctx.session.registrateEmployee.clothingSize,
    });
  } catch (err) {
    console.error(err);
    return RegistrateMessage.send(
      ctx,
      'Хмм, щось пішло не так 😢' + '\nСпробуйте трохи пізніше або зверніться до підтримки'
    );
  }

  ctx.session.registrateEmployee = {};
  await ctx.scene.leave();
  await scene.next(ctx);
});

export default scene;
