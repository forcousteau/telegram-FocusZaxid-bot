import api from './api';
import { IInteractiveTable } from '../types/interactiveTable';

export const fetchInteractiveTable = async ({ year, month }): Promise<IInteractiveTable> => {
  const { data } = await api.get('/interactiveTable', {
    params: { year, month }
  });
  return data.interactiveTable;
};

export const updateWorkingHours = async ({ employeeId, objectId, timestamp, hours }) => {
  await api.put('/interactiveTable/workingHours', { employeeId, objectId, timestamp, hours });
};

export const updateAdditionalPayments = async ({ employeeId, year, month, type, sum }) => {
  await api.put('/interactiveTable/additionalPayment', { employeeId, year, month, type, sum });
};
