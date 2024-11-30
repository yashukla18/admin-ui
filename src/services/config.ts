import { AxiosHeaders, AxiosRequestConfig } from 'axios';

export const authenticationConfig: AxiosRequestConfig = {
  timeout: 6000,
  withCredentials: true,
  baseURL: import.meta.env.VITE_IDENTITY_URL,
  headers: {
    common: new AxiosHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
  },
};

export const baseConfig: AxiosRequestConfig = {
  timeout: 6000,
  withCredentials: true,
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    common: new AxiosHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
  },
};

export const sisConfig: AxiosRequestConfig = {
  timeout: 20000,
  withCredentials: true,
  baseURL: import.meta.env.VITE_SIS_ENDPOINT,
  headers: {
    common: new AxiosHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
  },
};

export const extendedTimeoutConfig: AxiosRequestConfig = {
  ...baseConfig,
  timeout: 60000, // 1 minute timeout for usersRequest
};
