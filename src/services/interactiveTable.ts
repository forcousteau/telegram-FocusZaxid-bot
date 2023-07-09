import AdditionalPaymentType from '../enums/AdditionalPaymentType';
import { getDaysNumberInMonth } from './functions';
import { getAdditionalPaymentsByMonth } from './additionalPayments';
import {
  getReports,
  getSalary,
  getHoursTotal,
  getDatesHours,
  sortByWorkedDay,
  getBusinessTripPayment,
  getAdditionalPaymentsValues,
  groupByObjectsByEmployees,
} from './reports';

const MONEY_DECIMAL_PLACES = 2;

const COLUMNS_BEFORE_WORKING_HOURS = ['ПІБ', 'Телефон', 'Організація', 'ІПН', 'Посада', 'Ставка за годину', "Об'єкт"];

const COLUMNS_AFTER_WORKING_HOURS = [
  'Сума годин',
  'Відрядження',
  'Зарплата',
  'За доїзд',
  "Відрядження (разом за всіма об'єктами)",
  "Зарплата (разом за всіма об'єктами)",
  "За доїзд разом",
];

const ADDITIONAL_PAYMENTS = [
  {
    type: 'Аванс 1',
    value: AdditionalPaymentType.PREPAYMENT_1,
  },
  {
    type: 'Аванс 2',
    value: AdditionalPaymentType.PREPAYMENT_2,
  },
  {
    type: 'Відпускні',
    value: AdditionalPaymentType.VACATION_PAYMENT,
  },
  {
    type: 'Премія',
    value: AdditionalPaymentType.AWARD,
  },
  {
    type: 'Штраф',
    value: AdditionalPaymentType.PENALTY,
  },
];

async function getEmployeesDataForInteractiveTable(year: number, month: number) {
  const reports = await getReports(year, month);
  const additionalPayments = await getAdditionalPaymentsByMonth(year, month);

  // Sort employee reports by worked day (asc)
  reports.sort(sortByWorkedDay);

  const reportsByObjectsByEmployees = groupByObjectsByEmployees(reports);

  return reportsByObjectsByEmployees
    .map(reportsByObjectByEmployee => {
      const [reportByObjectByEmployee] = reportsByObjectByEmployee;

      return {
        id: reportByObjectByEmployee.employeeId,
        objectId: reportByObjectByEmployee.objectId,
        recordsBeforeWorkingHours: [
          reportByObjectByEmployee.fullName,
          reportByObjectByEmployee.phoneNumber,
          reportByObjectByEmployee.organisationName,
          reportByObjectByEmployee.identificationCode,
          reportByObjectByEmployee.positionName,
          reportByObjectByEmployee.positionPrice,
          reportByObjectByEmployee.objectName,
        ],
        recordsAfterWorkingHours: [
          getHoursTotal(reportsByObjectByEmployee).toFixed(MONEY_DECIMAL_PLACES),
          getBusinessTripPayment(reportsByObjectByEmployee).toFixed(MONEY_DECIMAL_PLACES),
          getSalary(reportsByObjectByEmployee).toFixed(MONEY_DECIMAL_PLACES),
          reportByObjectByEmployee.carFee.toFixed(MONEY_DECIMAL_PLACES),
          reportByObjectByEmployee.businessTripPaymentTotal.toFixed(MONEY_DECIMAL_PLACES),
          reportByObjectByEmployee.salaryTotal.toFixed(MONEY_DECIMAL_PLACES),
          reportByObjectByEmployee.carFeeSumForReport.toFixed(MONEY_DECIMAL_PLACES),
        ],
        recordsWorkingHours: getDatesHours(reportsByObjectByEmployee, month),
        recordsAdditionalPayments: getAdditionalPaymentsValues(
          additionalPayments.filter(({ employeeId }) => employeeId === reportByObjectByEmployee.employeeId)
        ),
        _fullName: reportByObjectByEmployee.fullName,
        _objectId: reportByObjectByEmployee.objectId,
      };
    })
    .sort((item1, item2) => item1._fullName.localeCompare(item2._fullName) || item1._objectId - item2._objectId);
}

export async function getInteractiveTable(year: number, month: number) {
  const days = getDaysNumberInMonth(month);
  const employees = await getEmployeesDataForInteractiveTable(year, month);

  return {
    columnsBeforeWorkingHours: COLUMNS_BEFORE_WORKING_HOURS,
    columnsAfterWorkingHours: COLUMNS_AFTER_WORKING_HOURS,
    days,
    additionalPayments: ADDITIONAL_PAYMENTS,
    employees,
  };
}
