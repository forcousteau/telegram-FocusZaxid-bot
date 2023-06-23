import api from './api';
import { IContractor } from '../types/contractors';

export const fetchContractors = async (): Promise<IContractor[]> => {
  const { data } = await api.get('/contractors');
  return data.contractors;
};

export const createContractor = async (fullName: string): Promise<void> => {
  await api.post('/contractors', { fullName });
};

export const editContractor = async (id: number, data: Partial<IContractor>): Promise<void> => {
  await api.put('/contractors', { id, data });
};

export const deleteContractors = async (ids: number[]): Promise<void> => {
  await api.delete('/contractors', { data: { ids } });
};
