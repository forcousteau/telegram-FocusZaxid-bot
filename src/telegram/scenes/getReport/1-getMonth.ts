import _ from 'lodash';
import moment from 'moment';
import Scene from 'telegraf/scenes/base';
import IScene from '../../typings/scene';
import HomeMessage from '../../controllers/home';
import { capitalizeWordsFirstLetters } from '../../../services/functions';
import { Markup } from 'telegraf';
import { checkEmployee } from '../../helpers/functions';
import { getReportsByEmployeeTable } from '../../../excel/tables/reports';

const scene: IScene = new Scene('getReport/getMonth');

scene.backScene = HomeMessage;

// Точка входа в сцену
scene.enter(async ctx => {
  const buttons = _.range(0, 6).map(i => {
    const m = moment().locale('uk').subtract(i, 'months');
    const date = m.toDate();

    const year = date.getFullYear();
    const month = date.getMonth();
    const caption = capitalizeWordsFirstLetters(m.format('MMMM YYYY'));

    return Markup.callbackButton(caption, [year, month].join('>'));
  });
  const keyboard = Markup.inlineKeyboard([...buttons, Markup.callbackButton('⏪ Назад', 'home')], { columns: 1 });
  await ctx.replyWithHTML('Оберіть місяць, за який бажаєте отримати звіт', keyboard.extra());
});

scene.action(/^(\d{4})>(\d{1,2})$/, async ctx => {
  const [year, month] = ctx.match.slice(1).map(x => +x);

  try {
    const m = moment({ year, month }).locale('uk');
    const excelTable = await getReportsByEmployeeTable(ctx.from.id, year, month);
    const filename = `Звіт за ${m.format('MMMM YYYY')}.xlsx`;
    await ctx.replyWithDocument({
      source: excelTable,
      filename,
    });
  } catch (err) {
    console.error(err);
    await HomeMessage.send(ctx, 'Не вдалось отримати Ваш звіт за місяць.\nПриносимо вибачення');
  }
});

export default scene;
