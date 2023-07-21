import _ from 'lodash';
import XlsxPopulate, { RichText } from 'xlsx-populate';
import WorkShiftActionType from '../enums/WorkShiftActionType';
import { isToday } from '../services/functions';
import { getContractorById } from '../services/contractors';
import { getStatsWorkShiftsActionsColumns, getTotalClothingColumns, getTotalShoeColumns } from './columns';

// .xlsx workbook init function
export async function initWorkbook(
  name: string,
  columns: Array<{
    name: string | null;
    width: number;
    isWeekend?: boolean;
  }>
) {
  // Generate .xlsx table and return it
  const workbook = await XlsxPopulate.fromBlankAsync();

  workbook
    .activeSheet()
    .name(name)
    .cell('A1')
    .value([columns.map(column => column.name)]);

  styleSheetWidth(workbook.activeSheet(), columns);

  return workbook;
}

export async function addTodayStatsSheet(workbook, workShiftsActions) {
  const todayStatsByContractors = workShiftsActions
    .filter(({ contractorId, createdAtDate }) => isToday(createdAtDate) && contractorId)
    .reduce((accum, workShiftAction) => {
      const { typeId, contractorId, contractorName } = workShiftAction;
      if (!accum[contractorId]) {
        accum[contractorId] = {
          contractorName,
          [WorkShiftActionType.OPEN]: 0,
          [WorkShiftActionType.CLOSE]: 0,
        };
      }
      accum[contractorId][typeId]++;
      return accum;
    }, {});

  const data = _.map(todayStatsByContractors, todayStat => [
    todayStat.contractorName,
    todayStat[WorkShiftActionType.OPEN],
    todayStat[WorkShiftActionType.CLOSE],
  ]);

  const columns = getStatsWorkShiftsActionsColumns();
  const sheet = workbook.addSheet('Статистика за сьогодні');
  sheet.cell('A1').value([columns.map(column => column.name)]);
  styleSheetWidth(sheet, columns);

  // If there is data for a report table
  if (data.length) {
    // Fill it in a table
    sheet.cell('A2').value(data);
  }
}

export async function addClothingTotalSheet(workbook, employees) {
  const clothingTotal = employees.reduce(
    (accum, { clothingSize }) => ({
      ...accum,
      [clothingSize]: accum[clothingSize] ? accum[clothingSize] + 1 : 1,
    }),
    {}
  );

  const data = _.map(clothingTotal, (totalNumber, clothingSize) => [clothingSize, totalNumber]);

  const columns = getTotalClothingColumns();
  const sheet = workbook.addSheet('Підсумок за одягом');
  sheet.cell('A1').value([columns.map(column => column.name)]);
  styleSheetWidth(sheet, columns);

  // If there is data for a report table
  if (data.length) {
    // Fill it in a table
    sheet.cell('A2').value(data);
  }
}

export async function addShoeTotalSheet(workbook, employees) {
  const shoeTotal = employees
    .map(employee => ({
      ...employee,
      shoeSize: employee.shoeSize || '-',
    }))
    .reduce(
      (accum, { shoeSize }) => ({
        ...accum,
        [shoeSize]: accum[shoeSize] ? accum[shoeSize] + 1 : 1,
      }),
      {}
    );

  const data = _.map(shoeTotal, (totalNumber, shoeSize) => [shoeSize, totalNumber]);

  const columns = getTotalShoeColumns();
  const sheet = workbook.addSheet('Підсумок за взуттям');
  sheet.cell('A1').value([columns.map(column => column.name)]);
  styleSheetWidth(sheet, columns);

  // If there is data for a report table
  if (data.length) {
    // Fill it in a table
    sheet.cell('A2').value(data);
  }
}

export async function addContractorsSheets(workbook, columns, dataByContractors, styleFuncs) {
  for (const contractorId in dataByContractors) {
    const dataByContractor = dataByContractors[contractorId];
    const contractor = await getContractorById(contractorId);

    const sheet = workbook.addSheet(contractor.fullName);
    sheet.cell('A1').value([columns.map(column => column.name)]);
    styleFuncs.forEach(styleFunc => styleFunc(sheet, columns));

    // If there is data for a report table
    if (dataByContractor.length) {
      // Fill it in a table
      sheet.cell('A2').value(dataByContractor);
    }
  }
}

export const styleSheetWidth = (sheet, columns) =>
  columns.forEach((__, index) =>
    sheet
      .column(index + 1)
      .width(columns[index].width)
      .style({ fontSize: 10 })
  );

export const styleSheetIsWeekend = (sheet, columns) =>
  columns.forEach((item, index) =>
    sheet
      .column(index+1)
      .style({
        border:true,
        fill: !!item?.isWeekend ? 'cccccc' : 0,
      })
  );

export const getWorkingHourChangedRichText = value =>
  new RichText().add(value.toString(), { fontColor: 'ff0000', fontSize: 10 });
