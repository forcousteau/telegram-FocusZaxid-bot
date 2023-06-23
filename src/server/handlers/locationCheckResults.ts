import { getLocationCheckResultTable } from '../../excel/tables/locationChecks';

const handlers = {
  table: {
    read: async ctx => {
      const { id } = ctx.query;

      if (!id) {
        return (ctx.status = 400);
      }

      try {
        const locationCheckResultTable = await getLocationCheckResultTable(id);
        ctx.set('Content-disposition', `attachment; filename*=UTF-8''${encodeURIComponent(`Проверка-${id}.xlsx`)}`);
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        ctx.body = locationCheckResultTable;
        ctx.status = 200;
      } catch (err) {
        console.error(err);
        ctx.status = 500;
      }
    },
  },
};

export default handlers;
