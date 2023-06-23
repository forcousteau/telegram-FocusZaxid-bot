import WorkShiftActionType from '../../enums/WorkShiftActionType';

export const addAttributesToWorkShiftsActions = workShiftsActions =>
  workShiftsActions.forEach(workShiftAction => {
    workShiftAction.objectName = workShiftAction.objectCity;
    workShiftAction.objectName += workShiftAction.objectAddress ? `, ${workShiftAction.objectAddress}` : '';
    workShiftAction.createdAtDate = workShiftAction.createdAt;
    workShiftAction.createdAt = new Date(workShiftAction.createdAt).toLocaleString('uk-UA');
    workShiftAction.businessTrip = workShiftAction.businessTrip ? 'Так' : 'Ні';
    workShiftAction.car = getCarStringForTable(workShiftAction);
  });

export const getCarStringForTable = workShiftAction =>
  workShiftAction.typeId === WorkShiftActionType.OPEN ? 'Див. закриття зміни' : workShiftAction.car ? 'Так' : 'Ні';
