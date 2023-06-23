import { isObject } from '../../services/functions';
import { getEmployeesForAdminPanel, updateEmployee, deleteEmployees } from '../../services/employees';

const handlers = {
  read: async ctx => {
    try {
      const employees = await getEmployeesForAdminPanel();
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
  update: async ctx => {
    const { id, data } = ctx.request.body;

    if (!id || !data || !isObject(data) || !Object.keys(data).length) {
      return (ctx.status = 400);
    }

    try {
      await updateEmployee(id, data);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  delete: async ctx => {
    const { ids } = ctx.request.body;

    if (!ids || !Array.isArray(ids)) {
      return (ctx.status = 400);
    }

    try {
      await deleteEmployees(ids);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
