import api from './api';
import { IEmployee } from '../types/employees';

export const fetchEmployees = async (): Promise<IEmployee[]> => {
  const { data } = await api.get('/employees');
  return data.employees;
};

export const editEmployee = async (id: number, data: Partial<IEmployee>) => {
  await api.put('/employees', { id, data });
};

export const deleteEmployees = async (ids: number[]) => {
  await api.delete('/employees', { data: { ids } });
};
