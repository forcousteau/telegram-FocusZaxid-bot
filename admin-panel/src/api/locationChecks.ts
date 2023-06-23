import api from './api';
import { ILocationCheck } from '../types/locationChecks';

export const fetchLocationChecks = async (): Promise<ILocationCheck[]> => {
  const { data } = await api.get('/locationChecks');
  return data.locationChecks;
}

export const createLocationCheck = async (): Promise<void> => {
  await api.post('/locationChecks');
}
