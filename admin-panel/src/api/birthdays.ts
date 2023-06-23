import api from './api';
import { IEmployee } from '../types/employees';

export const fetchBirthdays = async (): Promise<IEmployee[]> => {
  const { data } = await api.get('/birthdays');
  return data.employees;
};
