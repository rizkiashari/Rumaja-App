import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env';

const baseUrl = REACT_APP_BASE_URL;
console.log(baseUrl);

export const API = axios.create({
  baseURL: `https://rumaja.rizkiashari.xyz/api`,
});

export const configFormData = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
};

export const configJSON = {
  headers: {
    'Content-Type': 'application/json',
  },
};
