import _ from 'lodash';
import XlsxPopulate from 'xlsx-populate';
import { getVarByName } from '../../services/vars';
import {
  initWorkbook,
  styleSheetWidth,
  styleSheetIsWeekend,
  addContractorsSheets,
  getWorkingHourChangedRichText,
} from '../workbook';
import {
  getAdditionalPaymentsByEmployeeAndMonth,
  getAdditionalPaymentsByMonth,
} from '../../services/additionalPayments';
import {
  getReportsByDaysColumns,
  getReportsByObjectsColumns,
  getReportsByEmployeeColumns,
  getReportsByEmployeesColumns,
} from '../columns';
import {
  getSalary,
  getReports,
  getHoursTotal,
  getDatesHours,
  sortByWorkedDay,
  getReportsByEmployee,
  getBusinessTripPayment,
  getAdditionalPaymentsValues,
  groupByEmployees,
  groupByObjects,
  groupByObjectsByEmployees,
} from '../../services/reports';

export async function getReportsByEmployeeTable(chatId: number, year: number, month: number) {
  const reports = await getReportsByEmployee(chatId, year, month);
  const additionalPayments = await getAdditionalPaymentsByEmployeeAndMonth(chatId, year, month);

  // Sort employee reports by worked day (asc)
  reports.sort(sortByWorkedDay);

  const reportsByObjects = groupByObjects(reports);

  const data = _.map(reportsByObjects, reportsByObject => [
    reportsByObject[0].objectName,
    null,
    ...getDatesHours(reportsByObject, month).map(report => {
      if (report?.wasChanged) {
        return getWorkingHourChangedRichText(report.value);
      } else if (report) {
        return report.value;
      } else {
        return null;
      }
    }),
    null,
    getHoursTotal(reportsByObject),
    getBusinessTripPayment(reportsByObject),
    getSalary(reportsByObject),
    ...getAdditionalPaymentsValues(additionalPayments),
  ]);

  // Generate .xlsx table and return it
  const columns = getReportsByEmployeeColumns(year, month);
  const workbook = await initWorkbook('Звіт за працівником', columns);
  styleSheetIsWeekend(workbook.activeSheet(), columns);

  if (data.length) {
    workbook.activeSheet().cell('A2').value(data);
  }

  return workbook.outputAsync();
}

export async function getReportsByDaysTable(year: number, month: number) {
  const reports = await getReports(year, month);
  const additionalPayments = await getAdditionalPaymentsByMonth(year, month);

  // Sort employee reports by worked day (asc)
  reports.sort(sortByWorkedDay);

  const reportsByObjectsByEmployees = groupByObjectsByEmployees(reports);

  const data = reportsByObjectsByEmployees
    .sort((reportsByObjectByEmployee1, reportsByObjectByEmployee2) =>
      reportsByObjectByEmployee1[0].fullName.localeCompare(reportsByObjectByEmployee2[0].fullName)
    )
    .map(reportsByObjectByEmployee => [
      reportsByObjectByEmployee[0].phoneNumber,
      reportsByObjectByEmployee[0].organisationName,
      reportsByObjectByEmployee[0].identificationCode,
      reportsByObjectByEmployee[0].fullName,
      reportsByObjectByEmployee[0].positionName,
      reportsByObjectByEmployee[0].positionPrice,
      reportsByObjectByEmployee[0].objectName,
      null,
      ...getDatesHours(reportsByObjectByEmployee, month).map(report => {
        if (report?.wasChanged) {
          return getWorkingHourChangedRichText(report.value);
        } else if (report) {
          return report.value;
        } else {
          return null;
        }
      }),
      null,
      getHoursTotal(reportsByObjectByEmployee),
      getBusinessTripPayment(reportsByObjectByEmployee),
      getSalary(reportsByObjectByEmployee),
      reportsByObjectByEmployee[0].businessTripPaymentTotal,
      reportsByObjectByEmployee[0].salaryTotal,
      reportsByObjectByEmployee[0].carReportDays,
      ...getAdditionalPaymentsValues(
        additionalPayments.filter(
          additionalPayment => additionalPayment.employeeId === reportsByObjectByEmployee[0].employeeId
        )
      ),
    ]);

  // Generate .xlsx table and return it
  const columns = getReportsByDaysColumns(year, month);
  const workbook = await initWorkbook('Звіт', columns);
  styleSheetIsWeekend(workbook.activeSheet(), columns);

  if (data.length) {
    workbook.activeSheet().cell('A2').value(data);
  }

  return workbook.outputAsync();
}

export async function getReportsByEmployeesTable(year: number, month: number) {
  const reports = await getReports(year, month);
  const additionalPayments = await getAdditionalPaymentsByMonth(year, month);

  const reportsByEmployees = groupByEmployees(reports);

  // Get payment for a day with a car
  const carDayPaymentVar = await getVarByName('carDayPayment');
  const carDayPayment = carDayPaymentVar ? +carDayPaymentVar.value : null;

  const data = _.map(reportsByEmployees, reportsByEmployee => [
    reportsByEmployee[0].phoneNumber,
    reportsByEmployee[0].organisationName,
    reportsByEmployee[0].identificationCode,
    reportsByEmployee[0].fullName,
    reportsByEmployee[0].positionName,
    reportsByEmployee[0].positionPrice,
    getHoursTotal(reportsByEmployee),
    reportsByEmployee[0].businessTripPaymentTotal,
    reportsByEmployee[0].salaryTotal,
    reportsByEmployee[0].carReportDays,
    carDayPayment && reportsByEmployee[0].carReportDays ? carDayPayment * reportsByEmployee[0].carReportDays : '',
    ...getAdditionalPaymentsValues(
      additionalPayments.filter(additionalPayment => additionalPayment.employeeId === reportsByEmployee[0].employeeId)
    ),
  ]).sort((item1, item2) => item1[3].localeCompare(item2[3]));

  // Generate .xlsx table and return it
  const columns = getReportsByEmployeesColumns();
  const workbook = await initWorkbook('Звіт', columns);
  styleSheetIsWeekend(workbook.activeSheet(), columns);

  if (data.length) {
    workbook.activeSheet().cell('A2').value(data);
  }

  return workbook.outputAsync();
}

export async function getReportsByContractorsTable(year: number, month: number) {
  const reports = await getReports(year, month);

  const reportsByContractorsByObjectsByEmployees = reports
    .filter(report => report.contractorId)
    .reduce((accum, report) => {
      const { contractorId, objectId, employeeId } = report;
      if (!_.has(accum, [contractorId, objectId, employeeId])) {
        _.setWith(accum, [contractorId, objectId, employeeId], [], Object);
      }
      accum[contractorId][objectId][employeeId].push(report);
      return accum;
    }, {});

  const dataByContractors = {};
  for (const contractorId in reportsByContractorsByObjectsByEmployees) {
    const reportsByObjects = reportsByContractorsByObjectsByEmployees[contractorId];
    dataByContractors[contractorId] = [];

    for (const objectId in reportsByObjects) {
      const reportsByEmployees = reportsByObjects[objectId];

      for (const employeeId in reportsByEmployees) {
        const reportsByEmployee = reportsByEmployees[employeeId];

        // Sort employee reports by worked day (asc)
        reportsByEmployee.sort(sortByWorkedDay);

        const employeeData = [
          reportsByEmployee[0].phoneNumber,
          reportsByEmployee[0].organisationName,
          reportsByEmployee[0].identificationCode,
          reportsByEmployee[0].fullName,
          reportsByEmployee[0].positionName,
          reportsByEmployee[0].positionPrice,
          reportsByEmployee[0].objectName,
          null,
          ...getDatesHours(reportsByEmployee, month).map(report => {
            if (report?.wasChanged) {
              return getWorkingHourChangedRichText(report.value);
            } else if (report) {
              return report.value;
            } else {
              return null;
            }
          }),
          null,
          getHoursTotal(reportsByEmployee),
          getBusinessTripPayment(reportsByEmployee),
          getSalary(reportsByEmployee),
        ];

        // Push employee data to the array of all employees data
        dataByContractors[contractorId].push(employeeData);
      }
    }

    dataByContractors[contractorId].sort((item1, item2) => item1[3].localeCompare(item2[3]));
  }

  // Generate .xlsx table and return it
  const workbook = await XlsxPopulate.fromBlankAsync();
  const columns = getReportsByDaysColumns(year, month);

  await addContractorsSheets(workbook, columns, dataByContractors, [styleSheetWidth, styleSheetIsWeekend]);

  const sheets = workbook.sheets();
  if (sheets.length > 1) {
    workbook.deleteSheet(0);
  }

  return workbook.outputAsync();
}

export async function getReportsByObjectsTable(year: number, month: number) {
  const reports = await getReports(year, month);

  const reportsByObjects = groupByObjects(reports);

  const dataByObjects = _.map(reportsByObjects, reportsByObject => [
    reportsByObject[0].objectCity + ', ' + reportsByObject[0].objectAddress,
    getHoursTotal(reportsByObject),
    getSalary(reportsByObject),
    getBusinessTripPayment(reportsByObject),
    reportsByObject[0].contractorName,
  ]);

  // Generate .xlsx table and return it
  const workbook = await initWorkbook('Звіт', getReportsByObjectsColumns());

  if (dataByObjects.length) {
    workbook.activeSheet().cell('A2').value(dataByObjects);
  }

  return workbook.outputAsync();
}
