/* eslint-disable no-useless-catch */
import axios from 'axios';
import { LoginData } from '../types/CommonTypes';

export const loginAdmin = async (data: LoginData): Promise<any> => {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/admins/login`,
      data,
      { withCredentials: true }, // Add this line
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutAdmin = async (): Promise<any> => {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/admins/logout`,
      {},
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAdmin = async (): Promise<any> => {
  try {
    const response = await axios.get(
      'http://localhost:8000/api/v1/admins/check-auth',
      { withCredentials: true },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
