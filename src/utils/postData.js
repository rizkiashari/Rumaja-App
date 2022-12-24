import { API, configFormData, configJSON } from '../config/api';

export const postWithJson = async (url, dataPost) => {
  try {
    const response = await API.post(url, dataPost, configJSON);
    const data = response.data;
    return data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
  }
};

export const postWithFormData = async (url, dataPost) => {
  try {
    const response = await API.post(url, dataPost, configFormData);
    const data = response.data;
    return data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
  }
};
