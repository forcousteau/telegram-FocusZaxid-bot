import api from './api';

export const fetchWorkingHoursChanges = async (): Promise<any[]> => {
  const { data } = await api.get('/workingHoursChanges');
  return data.workingHoursChanges;
};
