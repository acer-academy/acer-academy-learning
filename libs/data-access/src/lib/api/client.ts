import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { csrfToken } from './helper/server-context';

// TODO: configure it with env
const BASE_URL = 'http://localhost:8000';

const client = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 30000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  params: {
    format: 'json',
  },
});

// TODO: work on access token implementation
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = '';
  config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
  return config;
});

const config: AxiosRequestConfig = {};
client(config);

const clientApi = {
  get: client.get,
  delete: client.delete,
  post: client.post,
  put: client.put,
  patch: client.patch,
};

Object.freeze(clientApi);

export default clientApi;
