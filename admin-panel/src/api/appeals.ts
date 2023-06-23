import api from './api';
import { IAppeal } from '../types/appeals';

export const fetchAppeals = async (): Promise<IAppeal[]> => {
  const { data } = await api.get('/appeals');
  return data.appeals;
};

export const deleteAppeals = async (ids: number[]): Promise<void> => {
  await api.delete('/appeals', { data: { ids } });
};

