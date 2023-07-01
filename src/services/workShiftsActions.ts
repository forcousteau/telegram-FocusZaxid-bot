import { Pool } from 'pg';
import moment from 'moment';
import DB from '../db/index';
import Queries from '../queries/queries';
import WorkShiftActionType from '../enums/WorkShiftActionType';
import WorkShiftActionDuplicateError from '../errors/workShiftActionDuplicate';
import { ONE_HOUR } from '../constants';
import { getVarByName } from './vars';
import { getHoursDifference } from './functions';
import { addWorkingHoursChange } from './workingHoursChanges';

interface IWorkShiftActionUpdate {
  location?: string;
  car?: boolean;
  businessTrip?: boolean;
  isRemainderSent?: boolean;
  createdAt?: boolean;
}

export async function addWorkShiftAction(data: {
  typeId: number;
  employeeId: number;
  objectId: number;
  location?: string;
  car?: boolean;
  carId?: number;
  carFee?: number;
  businessTrip?: boolean;
  createdAt?: Date;
}, params?: { pool: Pool }) {
  const pool = params?.pool || DB.getPool();

  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.insert({
    tableName: 'workShiftsActions',
    columns,
  });
  const res = await pool.query(query, values);
  return res.rows[0];
}

export async function addWorkShiftActionChecked(data: {
  typeId: number;
  employeeId: number;
  objectId: number;
  location?: string;
  car?: boolean;
  carId?: number;
  carFee?: number;
  businessTrip?: boolean;
}) {
  const lastWorkShiftAction = await getLastWorkShiftActionByEmployeeId(data.employeeId);

  if (lastWorkShiftAction && lastWorkShiftAction.typeId === data.typeId) {
    throw new WorkShiftActionDuplicateError();
  }

  return addWorkShiftAction(data);
}

export async function getLastWorkShiftActionByChatId(chatId: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.workShiftsActions.byChatId, [chatId]);
  return res.rows[0];
}

export async function getLastWorkShiftActionByEmployeeId(employeeId: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.workShiftsActions.lastByEmployeeId, [employeeId]);
  return res.rows[0];
}

export async function getLastWorkShiftsActionsOpened() {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.workShiftsActions.lastOpened);
  return res.rows;
}

export async function getWorkShiftsActionsForReminder(workShiftsActions) {
  const hoursCloseWorkShiftReminderVar = await getVarByName('hoursCloseWorkShiftReminder');
  const hoursAutoCloseWorkShiftVar = await getVarByName('hoursAutoCloseWorkShift');

  const hoursCloseWorkShiftReminder = hoursCloseWorkShiftReminderVar ? +hoursCloseWorkShiftReminderVar.value : null;
  const hoursAutoCloseWorkShift = hoursAutoCloseWorkShiftVar ? +hoursAutoCloseWorkShiftVar.value : null;

  if (!hoursCloseWorkShiftReminder || !hoursAutoCloseWorkShift) {
    return [];
  }

  return workShiftsActions.filter(
    workShiftAction =>
      !workShiftAction.isRemainderSent &&
      workShiftAction.createdAt <= new Date(Date.now() - hoursCloseWorkShiftReminder * ONE_HOUR) &&
      workShiftAction.createdAt >= new Date(Date.now() - hoursAutoCloseWorkShift * ONE_HOUR)
  );
}

export async function getWorkShiftsActionsForAutoClose(workShiftsActions) {
  const hoursAutoCloseWorkShiftVar = await getVarByName('hoursAutoCloseWorkShift');

  const hoursAutoCloseWorkShift = hoursAutoCloseWorkShiftVar ? +hoursAutoCloseWorkShiftVar.value : null;

  if (!hoursAutoCloseWorkShift) {
    return [];
  }

  return workShiftsActions.filter(
    workShiftAction => workShiftAction.createdAt <= new Date(Date.now() - hoursAutoCloseWorkShift * ONE_HOUR)
  );
}

export function getWorkShiftsActionsTotalHours(workShiftsActions) {
  const { totalHours, workShiftActionOpenPrev: lastWorkShiftActionOpen } = workShiftsActions.reduce(
    (accum, workShiftAction) => {
      if (workShiftAction.typeId === WorkShiftActionType.OPEN) {
        accum.workShiftActionOpenPrev = workShiftAction;
      } else {
        accum.totalHours += getHoursDifference(
          workShiftAction.createdAt,
          accum.workShiftActionOpenPrev
            ? accum.workShiftActionOpenPrev.createdAt
            : moment(workShiftAction.createdAt).startOf('day').toDate()
        );
        accum.workShiftActionOpenPrev = null;
      }

      return accum;
    },
    { totalHours: 0 }
  );

  return (
    totalHours +
    (lastWorkShiftActionOpen
      ? getHoursDifference(
          moment(lastWorkShiftActionOpen.createdAt).endOf('day').toDate(),
          lastWorkShiftActionOpen.createdAt
        )
      : 0)
  );
}

export async function getWorkingHoursBefore({ pool, employeeId, objectId, date }): Promise<number> {
  const { rows: workingHoursChanges } = await pool.query(Queries.select.workingHoursChanges.byDateAndEmployeeId, [
    employeeId,
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ]);

  if (workingHoursChanges.length) {
    return workingHoursChanges[0].workingHoursAfter;
  }

  const { rows: workShiftsActions } = await pool.query(Queries.select.workShiftsActions.byDateAndEmployeeId, [
    employeeId,
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ]);

  const workShiftsActionsByObject = workShiftsActions.filter(
    workShiftsAction => workShiftsAction.objectId === objectId
  );

  if (workShiftsActionsByObject.length) {
    return getWorkShiftsActionsTotalHours(workShiftsActionsByObject);
  }

  return 0;
}

export async function updateWorkShiftAction(id: number, data: IWorkShiftActionUpdate) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.update({
    tableName: 'workShiftsActions',
    columns,
    where: `id = ${id}`,
  });
  await pool.query(query, values);
}

export async function updateWorkShiftActions(ids: number[], data: IWorkShiftActionUpdate) {
  const pool = DB.getPool();
  const { columns, values } = Queries.convertObjectToColumnsAndValues(data);
  const query = Queries.build.update({
    tableName: 'workShiftsActions',
    columns,
    where: `id in (${ids.join(',')})`,
  });
  await pool.query(query, values);
}

export async function updateWorkingHours({ employeeId, objectId, date, hours }) {
  return DB.transaction(async pool => {
    const { rows: workShiftsActionsByObject } = await pool.query(Queries.select.workShiftsActions.byDateAndEmployeeIdAndObjectId, [
      employeeId,
      objectId,
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    ]);

    /**
     * No work shift for this object and this date.
     * When working hours are calculated, only days with
     * work shifts are considered. It means if we have a
     * working hours change – it won't be considered if there
     * were no work shifts for the specific date and object.
     * Thus we need to create a work shift (so that working
     * hours change will be considered).
     */
    if (!workShiftsActionsByObject.length) {
      await addWorkShiftAction({
        typeId: WorkShiftActionType.OPEN,
        employeeId,
        objectId,
        createdAt: moment(date).startOf('day').toDate(),
      }, { pool });
    
      await addWorkShiftAction({
        typeId: WorkShiftActionType.CLOSE,
        employeeId,
        objectId,
        createdAt: moment(date).startOf('day').toDate(),
      }, { pool });
    }

    const workingHoursBefore = await getWorkingHoursBefore({ pool, employeeId, objectId, date });

    await addWorkingHoursChange({
      date,
      workingHoursBefore,
      workingHoursAfter: hours,
      employeeId,
      objectId,
    }, { pool });

    return hours;
  });
}

export async function deleteWorkShiftActions(ids: number[]) {
  const pool = DB.getPool();
  await pool.query(Queries.delete.workShiftsActions.byIds, [ids]);
}
