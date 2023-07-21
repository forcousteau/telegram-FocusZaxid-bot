import _ from 'lodash';
import moment, { months } from 'moment';
import DB from '../db/index';
import Queries from '../queries/queries';
import WorkShiftActionType from '../enums/WorkShiftActionType';
import { getDaysNumberInMonth, roundMinutes, roundFloat, isSunday } from './functions';
import { getWorkingHoursChangesByMonth, getWorkingHoursChangesByChatIdAndMonth } from './workingHoursChanges';

const HOURS_DECIMAL_PLACES = 2;

function getCarFeeSumForReport(workShiftsActions) {
  return workShiftsActions
  .filter(workShiftAction => workShiftAction.carFee)
  .reduce((acc, cur) =>acc + cur.carFee, 0);
}

function getHours(timestamp1, timestamp2) {
  const minutes = roundMinutes((timestamp1 - timestamp2) / 1e3 / 60);
  const hours = minutes / 60;
  return roundFloat(hours, HOURS_DECIMAL_PLACES);
}

export async function getReportsByWorkShiftsActions(workShiftsActions, workingHoursChanges) {
  const carFeeSumForReport = getCarFeeSumForReport(workShiftsActions);
  const reports = [];

  /**
   * Employee can have multiple reports for the same object on the same day.
   * If working hours were changed by admin for the specific object on the specific day,
   * then only one report should be here.
   * This object is used to remember such changed hours.
   */
  const reportsWithChangedHoursFlags = {};

  let workShiftActionPrev = null;

  for (let i = 0; i < workShiftsActions.length; i++) {
    const workShiftAction = workShiftsActions[i];

    if (
      workShiftAction.typeId === WorkShiftActionType.OPEN &&
      workShiftsActions[i + 1] &&
      workShiftsActions[i + 1].createdAt.getDate() === workShiftAction.createdAt.getDate()
    ) {
      workShiftActionPrev = workShiftAction;
    } else if (
      !(
        workShiftAction.typeId === WorkShiftActionType.OPEN &&
        !workShiftsActions[i + 1] &&
        workShiftAction.createdAt.getDate() !== getDaysNumberInMonth(workShiftAction.createdAt.getMonth())
      )
    ) {
      const workedDayDate = new Date(workShiftAction.createdAt);
      const hours =
        workShiftAction.typeId === WorkShiftActionType.OPEN
          ? getHours(moment(workShiftAction.createdAt).endOf('day').toDate(), workShiftAction.createdAt)
          : getHours(
              workShiftAction.createdAt,
              workShiftActionPrev
                ? workShiftActionPrev.createdAt
                : moment(workShiftAction.createdAt).startOf('day').toDate()
            );

      const carFee = 
      workShiftAction.typeId === WorkShiftActionType.OPEN
          ? Number(workShiftAction?.carFee || 0)
          : Number(workShiftAction?.carFee || 0) + Number(workShiftActionPrev?.carFee || 0)

              
      if (!_.isNil(hours)) {
        const workingHoursChange = workingHoursChanges.find(
          workingHoursChange =>
            workingHoursChange.employeeId === workShiftAction.employeeId &&
            workingHoursChange.objectId === workShiftAction.objectId &&
            workingHoursChange.date.getDate() === workedDayDate.getDate() &&
            workingHoursChange.date.getMonth() === workedDayDate.getMonth() &&
            workingHoursChange.date.getFullYear() === workedDayDate.getFullYear()
        );

        const reportWithChangedHoursKey = [
          workShiftAction.employeeId,
          workShiftAction.objectId,
          workedDayDate.getDate(),
          workedDayDate.getMonth(),
          workedDayDate.getFullYear(),
        ].join(':');

        // Working hours were changed for this object and date, and report wasn't added yet
        if (workingHoursChange && !reportsWithChangedHoursFlags[reportWithChangedHoursKey]) {
          reports.push(
            _.assign({}, workShiftAction, {
              workedDayDate,
              carFee,
              carFeeSumForReport,
              hours: workingHoursChange.workingHoursAfter,
              wasChanged: true,
            })
          );

          reportsWithChangedHoursFlags[reportWithChangedHoursKey] = true;
        }
        // Working hours weren't changed - add simple report
        else if (!workingHoursChange) {
          reports.push(
            _.assign({}, workShiftAction, {
              workedDayDate,
              hours,
              carFee,
              carFeeSumForReport,
            })
          );
        }
      }

      workShiftActionPrev = null;
    }
  }

  return reports;
}

export async function getReportsByEmployee(chatId: number, year: number, month: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.workShiftsActions.forTableByEmployee, [chatId, year, month + 1]);

  const workingHoursChanges = await getWorkingHoursChangesByChatIdAndMonth(chatId, year, month);

  const reports = await getReportsByWorkShiftsActions(res.rows, workingHoursChanges);

  // If user has multiple reports at the same object
  // in one day - consolidate into one report
  const consolidatedReports = consolidateReportsByDays(reports);
  // Add business trip dividers
  // (if employee has multiple reports in the one day)
  addBusinessTripDividersToReports(consolidatedReports);
  // Add worked days and objects names to reports
  addAttributesToReports(consolidatedReports);

  return consolidatedReports;
}

export async function getReports(year: number, month: number) {
  const pool = DB.getPool();
  const res = await pool.query(Queries.select.workShiftsActions.forTableByDays, [year, month + 1]);
  const workShiftsActionsByEmployees = groupByEmployees(res.rows);
  const reports = [];

  const workingHoursChanges = await getWorkingHoursChangesByMonth(year, month);

  for (const employeeId of Object.keys(workShiftsActionsByEmployees)) {
    const workShiftsActionsByEmployee = workShiftsActionsByEmployees[employeeId];
    const reportsByEmployee = await getReportsByWorkShiftsActions(workShiftsActionsByEmployee, workingHoursChanges);
    reports.push(...reportsByEmployee);
  }

  // If user has multiple reports at the same object
  // in one day - consolidate into one report
  const consolidatedReports = consolidateReportsByDays(reports);
  // Add business trip dividers
  // (if employee has multiple reports in the one day)
  addBusinessTripDividersToReports(consolidatedReports);
  // Add worked days and objects names to reports
  addAttributesToReports(consolidatedReports);

  return consolidatedReports;
}

export const getAdditionalPaymentsValues = additionalPayments =>
  new Array(5).fill(null).map((item, index) => {
    const additionalPayment = additionalPayments.find(additionalPayment => additionalPayment.type === index + 1);
    return additionalPayment ? additionalPayment.sum : item;
  });

// Get total hours by reports
export const getHoursTotal = reports => reports.reduce((accum, report) => accum + report.hours, 0);

export const getCarFeeTotal = reports => reports.reduce((accum, report) => accum + Number(report.carFee), 0);

// Get business trip payment of the reports
export const getBusinessTripPayment = reports =>
  reports
    .filter(report => report.businessTrip)
    .reduce(
      (accum, { regionPrice, businessTripDivider }) =>
        businessTripDivider && businessTripDivider > 1
          ? accum + Math.round(regionPrice / businessTripDivider)
          : accum + regionPrice,
      0
    );

// Get salary of the reports
export const getSalary = reports =>
  reports.reduce((accum, { positionPrice, hours }) => accum + positionPrice * hours, 0);

// Sort reports by worked day
export const sortByWorkedDay = (a, b) => a.workedDay - b.workedDay;

export function getDatesHours(reports, month: number) {
  return reports
    .filter(report => report.workedDay)
    .reduce((employeeData, report) => {
      const { wasChanged, workedDay, hours } = report;

      const currentHours = employeeData[workedDay - 1]?.value ?? 0;

      employeeData[workedDay - 1] = {
        value: currentHours + hours,
        wasChanged,
      };

      return employeeData;
    }, new Array(getDaysNumberInMonth(month)).fill(null));
}

export function addAttributesToReports(reports) {
  const reportsByEmployees = groupByEmployees(reports);
  reports.forEach(report => {
    report.workedDay = report.workedDayDate.getDate();
    report.objectName = report.objectCity;
    report.objectName += report.objectAddress ? `, ${report.objectAddress}` : '';
    report.salaryTotal = getSalary(reportsByEmployees[report.employeeId]);
    report.businessTripPaymentTotal = getBusinessTripPayment(reportsByEmployees[report.employeeId]);
  });
}

export function addBusinessTripDividersToReports(reports) {
  const reportsByEmployeesByWorkedDays = reports
    .filter(report => report.businessTrip && report.regionPrice)
    .reduce((accum, report) => {
      const { employeeId, workedDayDate } = report;
      const workedDay = workedDayDate.getDate();
      if (!_.has(accum, [employeeId, workedDay])) {
        _.setWith(accum, [employeeId, workedDay], [], Object);
      }
      accum[employeeId][workedDay].push(report);
      return accum;
    }, {});

  for (const employeeId in reportsByEmployeesByWorkedDays) {
    const reportsByEmployeeByWorkedDays = reportsByEmployeesByWorkedDays[employeeId];
    for (const workedDay in reportsByEmployeeByWorkedDays) {
      const reportsByEmployeeByWorkedDay = reportsByEmployeeByWorkedDays[workedDay];
      reportsByEmployeeByWorkedDay.forEach(report => {
        report.businessTripDivider = reportsByEmployeeByWorkedDay.length;
      });
    }
  }
}

export function consolidateReportsByDays(reports) {
  const consolidatedReportsByDays = [];

  const reportsByEmployeesByObjectsByWorkedDays = reports.reduce((accum, report) => {
    const { employeeId, objectId, workedDayDate } = report;
    const workedDay = workedDayDate.getDate();
    if (!_.has(accum, [employeeId, objectId, workedDay])) {
      _.setWith(accum, [employeeId, objectId, workedDay], [], Object);
    }
    accum[employeeId][objectId][workedDay].push(report);
    return accum;
  }, {});

  for (const employeeId in reportsByEmployeesByObjectsByWorkedDays) {
    const reportsByEmployeeByObjectsByWorkedDays = reportsByEmployeesByObjectsByWorkedDays[employeeId];
    for (const objectId in reportsByEmployeeByObjectsByWorkedDays) {
      const reportsByEmployeeByObjectByWorkedDays = reportsByEmployeeByObjectsByWorkedDays[objectId];
      for (const workedDay in reportsByEmployeeByObjectByWorkedDays) {
        const reportsByEmployeeByObjectByWorkedDay = reportsByEmployeeByObjectByWorkedDays[workedDay];
        const consolidatedReport = reportsByEmployeeByObjectByWorkedDay.reduce((consolidatedReport, report) => ({
          ...consolidatedReport,
          hours: consolidatedReport.hours + report.hours,
          carFee: Number(consolidatedReport.carFee || 0) + Number(report.carFee || 0)
        }));

        consolidatedReportsByDays.push({
          ...consolidatedReport,
          hours: isSunday(consolidatedReport.workedDayDate)
            ? Math.min(6, consolidatedReport.hours)
            : consolidatedReport.hours >= 8
            ? consolidatedReport.hours - 1
            : consolidatedReport.hours,
        });
      }
    }
  }

  return consolidatedReportsByDays;
}

export const groupBy = (arr, func) =>
  _.values(
    arr.reduce((accum, item) => {
      const key = func(item);
      if (!accum[key]) {
        accum[key] = [];
      }
      accum[key].push(item);
      return accum;
    }, {})
  );

export const groupByObjectsByEmployees = arr =>
  groupBy(
    arr.filter(item => item.objectId && item.employeeId),
    ({ objectId, employeeId }) => `${objectId}:${employeeId}`
  );

export const groupByObjects = arr =>
  arr
    .filter(item => item.objectId)
    .reduce((accum, item) => {
      const { objectId } = item;
      if (!_.has(accum, objectId)) {
        _.set(accum, objectId, []);
      }
      accum[objectId].push(item);
      return accum;
    }, {});

export const groupByEmployees = arr =>
  arr
    .filter(item => item.employeeId)
    .reduce((accum, item) => {
      const { employeeId } = item;
      if (!_.has(accum, employeeId)) {
        _.set(accum, employeeId, []);
      }
      accum[employeeId].push(item);
      return accum;
    }, {});

export const groupByTravelDate = (carRecords, month) => {
      return carRecords
      .reduce((monthData, record) => {
        const { fuelPrice, distance , travelDate, fuelConsumption} = record;
    
        const travelDay = travelDate.getDate() - 1;
    
        if(!monthData[travelDay]){
          monthData[travelDay] = {
            dayDistance: Number(distance) + Number(distance),
            dayFuelPrice:((Number(fuelConsumption)/ 100) * Number(fuelPrice)).toFixed(2)
          };
        } else {
          monthData[travelDay].dayDistance += Number(distance) + Number(distance);      
        }
        return monthData;
      }, new Array(getDaysNumberInMonth(month)).fill(null));
}

export const groupCarRecordsByCarId = (carRecords, key ='carId') => {
  return carRecords.reduce((acc, cur) => {
    (acc[cur[key]] = acc[cur[key]] || []).push(cur);
    return acc;
  }, {});
};

export const groupCarRecordsFullPriceByKey = (carRecords, key = 'objectId') => {
  return carRecords.reduce((acc, cur) => {
    acc[cur[key]] = acc[cur[key]]
      ? acc[cur[key]] + cur.travelFullPrice
      : cur.travelFullPrice;
    return acc;
  }, {});
};  