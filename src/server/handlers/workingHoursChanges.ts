import { getWorkingHoursChangesForAdminPanel } from '../../services/workingHoursChanges';

const handlers = {
  read: async ctx => {
    try {
      const workingHoursChanges = await getWorkingHoursChangesForAdminPanel();
      ctx.status = 200;
      const body = {
        workingHoursChanges,
      };
      ctx.body = body;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
