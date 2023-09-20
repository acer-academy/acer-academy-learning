import { LoginData } from '../types/CommonTypes';
import axios from 'axios';

export const loginAdmin = async (data: LoginData): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/admins/login`,
      data,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
