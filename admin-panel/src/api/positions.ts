import api from './api';
import { IEmployee } from '../types/employees';
import { IPosition } from '../types/positions';

export const fetchPositions = async (): Promise<IPosition[]> => {
  const { data } = await api.get('/positions');
  return data.positions;
};

export const createPosition = async (positionCategoryId, { name, price }) => {
  await api.post('/positions', { positionCategoryId, name, price });
};

export const editPosition = async (id: number, data: Partial<IPosition>) => {
  await api.put('/positions', { id, data });
};
