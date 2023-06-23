import api from './api';
import { IRegistrationCode } from '../types/registrationCodes';

export const fetchRegistrationCodes = async (): Promise<IRegistrationCode[]> => {
  const { data } = await api.get('/registrationCodes');
  return data.registrationCodes;
};

export const createRegistrationCodes = async (codes: string[]): Promise<void> => {
  await api.post('/registrationCodes', { codes });
};

export const deleteRegistrationCodes = async (codes: string[]): Promise<void> => {
  await api.delete('/registrationCodes', { data: { codes } });
};
