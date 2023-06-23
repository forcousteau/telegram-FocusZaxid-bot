import IScene from '../../typings/scene';
import HomeMessage from '../../controllers/home';
import { getFileBotUrl, dowloadFile } from '../../../services/functions';
import { updateEmployee, getEmployeeByChatId } from '../../../services/employees';
import config from 'config';

const Scene = require('telegraf/scenes/base');

const scene: IScene = new Scene('inspectPersonInfo/editPhoto');

scene.backScene = 'inspectPersonInfo/getWhatToEdit';
scene.nextScene = HomeMessage;

scene.enter(async (ctx: any) => {
  await ctx.replyWithHTML('Відправте нову <b>фотографію</b>', scene.backInlineKeyboard.extra());
});

scene.on('photo', async (ctx: any) => {
  await ctx.scene.leave();
  const photoName = ctx.message.text;
  try {
    const screenUrl = await getFileBotUrl(ctx, ctx.message.photo[ctx.message.photo.length - 1].file_id);
    const photoName = await dowloadFile(screenUrl, config.get<string>('server.imagePath'));
    const employee = await getEmployeeByChatId(ctx.from.id);
    await updateEmployee(employee.id, { photoName });
    await scene.next(ctx, 'Фотографію успішно змінено 👌');
  } catch (err) {
    console.error(err);
    await scene.next(ctx, 'Помилка при зміні фотографії. Спробуйте пізніше');
  }
});

export default scene;
