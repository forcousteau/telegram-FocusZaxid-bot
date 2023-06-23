import api from './api';
import { IObject } from '../types/objects';

export const fetchObjects = async (): Promise<IObject[]> => {
  const { data } = await api.get('/objects');
  return data.objects;
};

export const createObject = async (regionId: number, city: string, address: string, contractorId: number | null): Promise<void> => {
  await api.post('/objects', { regionId, city, address, contractorId });
};

export const editObject = async (id: number, data: Partial<IObject>): Promise<void> => {
  await api.put('/objects', { id, data });
};
