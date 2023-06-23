import _ from 'lodash';
import { getInteractiveTable } from '../../services/interactiveTable';
import { updateWorkingHours } from '../../services/workShiftsActions';
import { updateAdditionalPayment } from '../../services/additionalPayments';

const handlers = {
  read: async ctx => {
    const params = {
      year: parseInt(ctx.query.year),
      month: parseInt(ctx.query.month),
    };

    if (_.isNil(params.year) || _.isNil(params.month)) {
      return (ctx.status = 400);
    }

    try {
      const interactiveTable = await getInteractiveTable(params.year, params.month);
      ctx.status = 200;
      const body = {
        interactiveTable,
      };
      ctx.body = body;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  updateWorkingHours: async ctx => {
    const params = {
      employeeId: ctx.request.body.employeeId,
      objectId: ctx.request.body.objectId,
      date: new Date(parseInt(ctx.request.body.timestamp)),
      hours: parseFloat(ctx.request.body.hours),
    };

    if (
      _.isNil(params.employeeId) ||
      _.isNil(params.objectId) ||
      _.isNil(params.date) ||
      _.isNil(params.hours) ||
      params.hours < 0 ||
      params.hours > 24
    ) {
      return (ctx.status = 400);
    }

    try {
      await updateWorkingHours(params);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
  updateAdditionalPayment: async ctx => {
    const params = {
      employeeId: ctx.request.body.employeeId,
      type: ctx.request.body.type,
      sum: parseFloat(ctx.request.body.sum),
      year: parseFloat(ctx.request.body.year),
      month: parseFloat(ctx.request.body.month),
    };

    if (
      _.isNil(params.employeeId) ||
      _.isNil(params.year) ||
      _.isNil(params.month) ||
      _.isNil(params.type) ||
      _.isNil(params.sum)
    ) {
      return (ctx.status = 400);
    }

    try {
      await updateAdditionalPayment(params);
      ctx.status = 200;
    } catch (err) {
      console.error(err);
      ctx.status = 500;
    }
  },
};

export default handlers;
