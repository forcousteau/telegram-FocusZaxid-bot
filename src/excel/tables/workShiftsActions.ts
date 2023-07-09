import _ from 'lodash';
import DB from '../../db/index';
import Queries from '../../queries/queries';
import { addAttributesToWorkShiftsActions } from '../helpers/workShiftsActions';
import { getWorkShiftsActionsColumns } from '../columns';
import { initWorkbook, addTodayStatsSheet, addContractorsSheets, styleSheetWidth } from '../workbook';

/*** Reports excel tables functions ***/

export async function getWorkShiftsActionsTable(year: number, month: number) {
  const pool = DB.getPool();
  const { rows: workShiftsActions } = await pool.query(Queries.select.workShiftsActions.forTable, [year, month + 1]);

  addAttributesToWorkShiftsActions(workShiftsActions);

  const data = workShiftsActions.map(workShiftAction => [
    workShiftAction.contractorId,
    [
      workShiftAction.phoneNumber,
      workShiftAction.organisationName,
      workShiftAction.identificationCode,
      workShiftAction.fullName,
      workShiftAction.positionName,
      workShiftAction.positionPrice,
      workShiftAction.objectName,
      workShiftAction.location,
      workShiftAction.workShiftTypeName,
      workShiftAction.createdAt,
      workShiftAction.carName,
      workShiftAction.businessTrip,
    ],
  ]);

  const dataByContractors = data
    .filter(([contractorId]) => contractorId)
    .reduce((accum, [contractorId, data]) => {
      if (!_.has(accum, contractorId)) {
        _.setWith(accum, contractorId, [], Object);
      }
      accum[contractorId].push(data);
      return accum;
    }, {});

  // Generate .xlsx table and return it
  const columns = getWorkShiftsActionsColumns();
  const workbook = await initWorkbook('Звіт', columns);

  // If there is data for a table
  if (data.length) {
    // Fill it in a table
    workbook
      .activeSheet()
      .name('Всі працівники')
      .cell('A2')
      .value(data.map(([contractorId, data]) => data));
  }

  // Data by each contractor
  await addContractorsSheets(workbook, columns, dataByContractors, [styleSheetWidth]);
  // General stats data
  await addTodayStatsSheet(workbook, workShiftsActions);

  return workbook.outputAsync();
}
