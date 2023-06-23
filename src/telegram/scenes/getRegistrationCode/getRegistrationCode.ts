import IScene from '../../typings/scene';
import RegistrateMessage from '../../controllers/registrate';
import { checkRegistrationCode, deleteRegistrationCode } from '../../../services/registrationCodes';
import { addUser } from '../../helpers/functions';

const Scene = require('telegraf/scenes/base');

const scene: IScene = new Scene('getRegistrationCode');

scene.nextScene = RegistrateMessage;

scene.enter(async (ctx: any) => {
  await ctx.replyWithHTML('Щоб продовжити, введіть реєстраційний <b>код</b>');
});

scene.on('message', async (ctx: any) => {
  const code = ctx.message.text;

  const codeExists = await checkRegistrationCode(code);

  if (!codeExists) {
    await ctx.replyWithHTML('Ви ввели <b>неіснуючий</b> код.\nСпробуйте знову');
    return ctx.scene.reenter();
  }

  try {
    await deleteRegistrationCode(code);
  } catch (err) {
    console.error(err);
  }

  let chatId = ctx.from.id;
  let username = ctx.from.username;
  let name = ctx.from.first_name;

  if (ctx.from.last_name !== undefined) name = `${ctx.from.first_name} ${ctx.from.last_name}`;

  let isAdmin = [300922262, 461738219, 663355693].includes(chatId);
  let insertDoc: any = {
    chatId: chatId,
    name: name,
  };

  if (username) insertDoc.username = username;
  if (isAdmin) insertDoc.isAdmin = true;
  try {
    await addUser(insertDoc);
  } catch (err) {
    console.error(err);
    await ctx.replyWithHTML(
      'На жаль, не вдалося Вас зареєструвати 😢\nСпробуйте трохи пізніше або зверніться до підтримки'
    );
    return ctx.scene.reenter();
  }

  await ctx.scene.leave();
  await scene.next(ctx);
});

export default scene;
