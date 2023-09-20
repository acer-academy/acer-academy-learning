import axios from 'axios';

const baseURL = 'http://localhost:8000/api/v1/centres';

export const retrieveCentres = async (): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.get(`${baseURL}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
