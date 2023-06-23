import api from './api';

export const checkAuth = async () => {
  const { data } = await api.get('/auth/check');
  return data;
};

export const login = async ({ username, password }) => {
  const { data } = await api.post('/auth/login', { username, password });
  return data;
};

export const logout = async () => {
  const { status } = await api.get('/auth/logout');
  return status === 200;
};

