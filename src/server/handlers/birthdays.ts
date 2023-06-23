import { isObject } from '../../services/functions';
import { getEmployeesByBirthday } from '../../services/employees';

const handlers = {
  read: async ctx => {
    try {
      const currentDate = new Date();
      const employees = await getEmployeesByBirthday(currentDate.getDate(), currentDate.getMonth());
      ctx.status = 200;
      const body = {
        employees,
      };
      ctx.body = body;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
