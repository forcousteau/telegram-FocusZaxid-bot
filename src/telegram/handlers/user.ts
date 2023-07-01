import HomeMessage from '../controllers/home';
import WorkShiftMessage from '../controllers/workShift';
import WorkShiftActionType from '../../enums/WorkShiftActionType';
import LocationCheckStatus from '../../enums/LocationCheckStatus';
import { getEmployeeByChatId } from '../../services/employees';
import { checkEmployee, getUserByChatId } from '../helpers/functions';
import { getLastWorkShiftActionByChatId } from '../../services/workShiftsActions';
import { getLocationCheckById, addLocationCheckResult, checkForLocationReport } from '../../services/locationChecks';

const UserHandlers = {
  init: bot => {
    bot.action('home', async ctx => {
      ctx.answerCbQuery();
      await checkEmployee(ctx, async () => {
        return HomeMessage.send(ctx);
      });
    });

    bot.action('workShift', async ctx => {
      ctx.answerCbQuery();
      await checkEmployee(ctx, async () => {
        return WorkShiftMessage.send(ctx);
      });
    });

    bot.action('workShiftOpen', async ctx => {
      ctx.answerCbQuery();
      await checkEmployee(ctx, async () => {
        const workShiftAction = await getLastWorkShiftActionByChatId(ctx.from.id);
        if (workShiftAction?.typeId === WorkShiftActionType.OPEN) {
          return WorkShiftMessage.send(ctx, 'Ви вже відкрили робочу зміну. Необхідно закрити поточну зміну');
        }
        return ctx.scene.enter('openWorkShift/getRegion');
      });
    });

    bot.action('workShiftClose', async ctx => {
      ctx.answerCbQuery();
      await checkEmployee(ctx, async () => {
        const workShiftAction = await getLastWorkShiftActionByChatId(ctx.from.id);
        if (!workShiftAction || workShiftAction.typeId === WorkShiftActionType.CLOSE) {
          return WorkShiftMessage.send(ctx, 'Немає поточної відкритої зміни. Необхідно відкрити робочу зміну');
        }
        ctx.session.closeWorkShift = {
          objectId: workShiftAction.objectId,
          businessTrip: workShiftAction.businessTrip,
        };
        await ctx.scene.enter('closeWorkShift/getBusinessTrip');
      });
    });

    bot.action('monthReport', async ctx => {
      ctx.answerCbQuery();
      await checkEmployee(ctx, async () => {
        await ctx.scene.enter('getReport/getMonth');
      });
    });

    bot.action('userInfo', async ctx => {
      ctx.answerCbQuery();
      await checkEmployee(ctx, async () => {
        return ctx.scene.enter('inspectPersonInfo/getPersonInfo');
      });
    });

    bot.action('leaveAppeal', async ctx => {
      ctx.answerCbQuery();
      await checkEmployee(ctx, async () => {
        return ctx.scene.enter('leaveAppeal/getText');
      });
    });

    bot.action('register', async ctx => {
      ctx.answerCbQuery();
      const user = await getUserByChatId(ctx.from.id);
      if (!user) {
        return ctx.scene.enter('getRegistrationCode');
      }
      const employee = await getEmployeeByChatId(ctx.from.id);
      if (employee) {
        return HomeMessage.send(ctx, 'Ви вже зареєстровані, дякуємо 😄.\nЩо Ви бажаєте зробити?');
      }
      await ctx.scene.enter('registrateEmployee/getFullName');
    });

    bot.action(/^working>/, async ctx => {
      ctx.answerCbQuery();
      const query = ctx.callbackQuery.data.split('>');
      const employee = await getEmployeeByChatId(ctx.from.id);
      const locationCheckId = query[2];

      try {
        const hasLocationReport = await checkForLocationReport(employee.id, locationCheckId);
        if (hasLocationReport) {
          return HomeMessage.send(ctx, 'Ви вже відмітились!\nЩо Ви бажаєте зробити?');
        }

        const locationCheck = await getLocationCheckById(locationCheckId);
        if (!locationCheck || locationCheck.status !== LocationCheckStatus.ACTIVE) {
          return HomeMessage.send(ctx, 'На жаль, ви не можете відмітитись.\nПеревірка геолокації була завершена');
        }
      } catch (err) {
        return HomeMessage.send(ctx, 'На жаль, не вдалось відмітитись.\nСпробуйте пізніше');
      }

      ctx.session.locationCheckId = locationCheckId;

      if (query[1] == 'true') {
        await ctx.scene.enter('getLocation');
      } else {
        try {
          await addLocationCheckResult({
            locationCheckId: locationCheckId,
            employeeId: employee.id,
            working: false,
          });
        } catch (err) {
          await HomeMessage.send(ctx);
          console.error(err);
        }
        await HomeMessage.send(ctx);
      }
    });
  },
};

export default UserHandlers;
