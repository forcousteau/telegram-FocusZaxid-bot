import HomeMessage from '../../telegram/controllers/home';
import WorkShiftActionType from '../../enums/WorkShiftActionType';
import { getWorkShiftKeyboard } from '../../telegram/helpers/keyboards';
import {
  updateWorkShiftActions,
  deleteWorkShiftActions,
  getLastWorkShiftsActionsOpened,
  getWorkShiftsActionsForReminder,
  getWorkShiftsActionsForAutoClose,
} from '../../services/workShiftsActions';
import { ONE_MINUTE } from '../../constants';

export const interval = 10 * ONE_MINUTE; // 10 minutes

async function processReminders(bot, workShiftsActionsForReminder) {
  // Send remainders
  const workShiftsKeyboard = getWorkShiftKeyboard(WorkShiftActionType.OPEN);
  for (const { chatId } of workShiftsActionsForReminder) {
    try {
      await bot.telegram.sendMessage(
        chatId,
        'В вас відкрита поточна робоча зміна. Нагадуємо про необхідність закриття зміни',
        workShiftsKeyboard.extra()
      );
    } catch (err) {
      console.error(err);
    }
  }
  // Set isRemainderSent: true not to send repeating remainders in future
  if (workShiftsActionsForReminder.length) {
    try {
      await updateWorkShiftActions(
        workShiftsActionsForReminder.map(workShiftAction => workShiftAction.id),
        { isRemainderSent: true }
      );
    } catch (err) {
      console.error(err);
    }
  }
}

async function processAutoClose(bot, workShiftsActionsForAutoClose) {
  if (workShiftsActionsForAutoClose.length) {
    try {
      await deleteWorkShiftActions(workShiftsActionsForAutoClose.map(workShiftAction => workShiftAction.id));
    } catch (err) {
      console.error(err);
    }
  }

  for (const { chatId } of workShiftsActionsForAutoClose) {
    try {
      await bot.telegram.sendMessage(
        chatId,
        'Ви не зачинили вашу поточну зміну, тому вона була автоматично анульована',
        HomeMessage.keyboard.extra()
      );
    } catch (err) {
      console.error(err);
    }
  }
}

export async function daemon(bot) {
  const workShiftsActions = await getLastWorkShiftsActionsOpened();
  const workShiftsActionsForReminder = await getWorkShiftsActionsForReminder(workShiftsActions);
  const workShiftsActionsForAutoClose = await getWorkShiftsActionsForAutoClose(workShiftsActions);

  await processReminders(bot, workShiftsActionsForReminder);
  await processAutoClose(bot, workShiftsActionsForAutoClose);
}

export default {
  interval,
  daemon,
};
