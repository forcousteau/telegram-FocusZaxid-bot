import api from './api';
import { IVariable } from '../types/vars';

export const fetchVariables = async (): Promise<IVariable[]> => {
  const { data } = await api.get('/vars');
  return data.vars;
};

export const editVariable = async (id: number | null, data: Partial<IVariable>): Promise<void> => {
  await api.put('/vars', { id, data });
};
