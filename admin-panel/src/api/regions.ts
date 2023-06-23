import api from './api';
import { IRegion } from '../types/regions';

export const fetchRegions = async (): Promise<IRegion[]> => {
  const { data } = await api.get('/regions');
  return data.regions;
};

export const createRegion = async (name: string, price: number): Promise<void> => {
  await api.post('/regions', { name, price });
};

export const editRegion = async (id: number, data: Partial<IRegion>): Promise<void> => {
  await api.put('/regions', { id, data });
};
