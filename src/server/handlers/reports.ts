import { bufferToStream } from '../../services/functions';
import { getAppealsTable } from '../../excel/tables/appeals';
import { getClothingTable } from '../../excel/tables/clothing';
import { getWorkShiftsActionsTable } from '../../excel/tables/workShiftsActions';
import {
  getReportsByDaysTable,
  getReportsByEmployeesTable,
  getReportsByContractorsTable,
  getReportsByObjectsTable,
} from '../../excel/tables/reports';

const COLON_ESCAPED = '%27';

const handlers = {
  byDays: {
    read: async ctx => {
      const { year, month } = ctx.query;

      if (!year || !month) {
        return (ctx.status = 400);
      }

      try {
        const reportsByDaysTable = await getReportsByDaysTable(+year, +month);
        ctx.set('Content-disposition', `attachment; filename*=UTF-8''${encodeURIComponent('Звіт по дням.xlsx')}`);
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        ctx.body = bufferToStream(reportsByDaysTable);
        ctx.status = 200;
      } catch (err) {
        console.error(err);
        ctx.status = 500;
      }
    },
  },
  workShiftsActions: {
    read: async ctx => {
      const { year, month } = ctx.query;

      if (!year || !month) {
        return (ctx.status = 400);
      }

      try {
        const workShiftsActionsTable = await getWorkShiftsActionsTable(+year, +month);
        ctx.set('Content-disposition', `attachment; filename*=UTF-8''${encodeURIComponent('Звіт по змінах.xlsx')}`);
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        ctx.body = bufferToStream(workShiftsActionsTable);
        ctx.status = 200;
      } catch (err) {
        console.error(err);
        ctx.status = 500;
      }
    },
  },
  appeals: {
    read: async ctx => {
      const { year, month } = ctx.query;

      if (!year || !month) {
        return (ctx.status = 400);
      }

      try {
        const appealsTable = await getAppealsTable(+year, +month);
        ctx.set('Content-disposition', `attachment; filename*=UTF-8''${encodeURIComponent('Примітки.xlsx')}`);
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        ctx.body = bufferToStream(appealsTable);
        ctx.status = 200;
      } catch (err) {
        console.error(err);
        ctx.status = 500;
      }
    },
  },
  clothing: {
    read: async ctx => {
      try {
        const clothingTable = await getClothingTable();
        ctx.set('Content-disposition', `attachment; filename*=UTF-8''${encodeURIComponent('Одяг.xlsx')}`);
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        ctx.body = bufferToStream(clothingTable);
        ctx.status = 200;
      } catch (err) {
        console.error(err);
        ctx.status = 500;
      }
    },
  },
  byEmployees: {
    read: async ctx => {
      const { year, month } = ctx.query;

      if (!year || !month) {
        return (ctx.status = 400);
      }

      try {
        const reportsByEmployeesTable = await getReportsByEmployeesTable(+year, +month);
        ctx.set(
          'Content-disposition',
          `attachment; filename*=UTF-8''${encodeURIComponent('Звіт по працівниках.xlsx')}`
        );
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        ctx.body = bufferToStream(reportsByEmployeesTable);
        ctx.status = 200;
      } catch (err) {
        console.error(err);
        ctx.status = 500;
      }
    },
  },
  byContractors: {
    read: async ctx => {
      const { year, month } = ctx.query;

      if (!year || !month) {
        return (ctx.status = 400);
      }

      try {
        const reportsByContractorsTable = await getReportsByContractorsTable(+year, +month);
        ctx.set('Content-disposition', `attachment; filename*=UTF-8''${encodeURIComponent('Звіт по виконробах.xlsx')}`);
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        ctx.body = bufferToStream(reportsByContractorsTable);
        ctx.status = 200;
      } catch (err) {
        console.error(err);
        ctx.status = 500;
      }
    },
  },
  byObjects: {
    read: async ctx => {
      const { year, month } = ctx.query;

      if (!year || !month) {
        return (ctx.status = 400);
      }

      try {
        const reportsByObjectsTable = await getReportsByObjectsTable(+year, +month);
        ctx.set(
          'Content-disposition',
          `attachment; filename*=UTF-8''${encodeURIComponent(`Звіт по об'єктах.xlsx`).replace(/'/g, COLON_ESCAPED)}`
        );
        ctx.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        ctx.body = bufferToStream(reportsByObjectsTable);
        ctx.status = 200;
      } catch (err) {
        console.error(err);
        ctx.status = 500;
      }
    },
  },
};

export default handlers;
