import { IAdmin, IAdminsRole } from '../types/admins';
import api from './api';

export const fetchAdmins = async (): Promise<IAdmin[]> => {
  const { data } = await api.get('/webadmins');
  return data.webadmins;
};

export const createAdmin = async (data: { username: string, password: string, roleId: number }): Promise<void> => {
  await api.post('/webadmins', data);
};

export const editAdmin = async (id: string, data: Partial<IAdmin>): Promise<void> => {
  await api.put('/webadmins', { id, data });
};

export const deleteAdmins = async (ids: string[]): Promise<void> => {
  await api.delete('/webadmins', { data: { ids } });
};

export const fetchAdminsRoles = async (): Promise<IAdminsRole[]> => {
  const { data } = await api.get('/webadminsRoles');
  return data.webadminsRoles;
};
