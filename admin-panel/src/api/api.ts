import axios from 'axios';
import { buildServerPath } from '../helpers/functions';

const apiURL = buildServerPath() + '/api';

const api = axios.create({
  baseURL: apiURL,
  withCredentials: true
});

export { apiURL };
export default api;
