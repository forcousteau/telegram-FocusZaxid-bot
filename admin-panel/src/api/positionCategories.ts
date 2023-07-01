import api from './api';
import { IPositionCategory } from '../types/positionCategories';

export const fetchPositionCategories = async (): Promise<IPositionCategory[]> => {
  const { data } = await api.get('/positionCategories');
  return data.positionCategories;
};

export const createPositionCategory = async (name: string): Promise<void> => {
  await api.post('/positionCategories', { name });
};

export const editPositionCategory = async (id: number, data: Partial<IPositionCategory>): Promise<void> => {
  await api.put('/positionCategories', { id, data });
};
