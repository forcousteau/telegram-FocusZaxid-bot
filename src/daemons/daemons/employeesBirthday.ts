import HomeMessage from '../../telegram/controllers/home';
import { getEmployeesByBirthday } from '../../services/employees';
import { ONE_HOUR } from '../../constants';

export const interval = 3 * ONE_HOUR; // 3 hours

export async function daemon(bot) {
  const currentDate = new Date();
  if (currentDate.getHours() >= 9 && currentDate.getHours() < 12) {
    const employees = await getEmployeesByBirthday(currentDate.getDate(), currentDate.getMonth());
    for (const employee of employees) {
      await bot.telegram.sendMessage(
        employee.chatId,
        'Компанія Террапроф вітає вас з днем народження!',
        HomeMessage.keyboard.extra()
      );
    }
  }
}

export default {
  interval,
  daemon,
};
