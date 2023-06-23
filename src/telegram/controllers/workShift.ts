import { getWorkShiftKeyboard } from '../helpers/keyboards';
import { getLastWorkShiftActionByChatId } from '../../services/workShiftsActions';

const WorkShiftMessage = {
  send: async function (ctx, message: string = 'Що Ви бажаєте зробити?') {
    const workShiftAction = await getLastWorkShiftActionByChatId(ctx.from.id);
    const keyboard = getWorkShiftKeyboard(workShiftAction?.typeId || null);
    await ctx.replyWithHTML(message, keyboard.extra());
  },
};

export default WorkShiftMessage;
