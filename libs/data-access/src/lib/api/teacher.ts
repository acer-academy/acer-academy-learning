/* eslint-disable no-useless-catch */
import { LoginData } from '../types/CommonTypes';
import axios from 'axios';

export const loginTeacher = async (data: LoginData): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/teachers/login`,
      data,
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutTeacher = async (): Promise<any> => {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/teachers/logout`,
      {},
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTeacher = async (): Promise<any> => {
  try {
    const response = await axios.get(
      'http://localhost:8000/api/v1/teachers/check-auth',
      { withCredentials: true },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
