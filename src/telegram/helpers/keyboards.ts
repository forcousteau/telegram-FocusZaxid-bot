import _ from 'lodash';
import { Markup } from 'telegraf';
import WorkShiftActionType from '../../enums/WorkShiftActionType';

export async function getInlineKeyboardWithBackButton(items, limit: number, auxiliaryButton = null) {
  const buttons = _.chunk(items, limit);
  buttons.push([Markup.callbackButton('⏪ Назад', 'back'), auxiliaryButton].filter(item => item));

  return Markup.inlineKeyboard(buttons);
}

export function getWorkShiftKeyboard(workShiftType: WorkShiftActionType) {
  const button =
    workShiftType === WorkShiftActionType.OPEN
      ? Markup.callbackButton('Закрити зміну ❌', 'workShiftClose')
      : Markup.callbackButton('Відкрити зміну ➡️', 'workShiftOpen');
  return Markup.inlineKeyboard([button, Markup.callbackButton('⏪ Назад', 'home')], { columns: 1 });
}
