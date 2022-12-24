import { API } from '../config/api';

export async function getData(url) {
  try {
    const { data } = await API.get(url);

    return data;
  } catch ({ response }) {
    if (response) {
      return response.data;
    }
  }
}
