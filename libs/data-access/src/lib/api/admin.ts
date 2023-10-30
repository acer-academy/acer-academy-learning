import axios, { AxiosResponse } from 'axios';
import client from './client';
import { LoginData, LogoutResponse } from '../types/CommonTypes';
import { Admin } from '../types/admin';

const URL = '/admins';

interface RegisterAdminData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UpdateAdminData {
  firstName?: string;
  lastName?: string;
  password?: string;
}

export async function registerAdmin(
  data: RegisterAdminData,
): Promise<AxiosResponse<Admin>> {
  try {
    const response: AxiosResponse<Admin> = await client.post(
      `${URL}/register`,
      data,
    );
    return response;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      throw error.response.data.error;
    } else {
      throw error;
    }
  }
}

export async function loginAdmin(
  data: LoginData,
): Promise<AxiosResponse<Admin>> {
  try {
    const response: AxiosResponse<Admin> = await client.post(
      `${URL}/login`,
      data,
    );
    return response;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      throw error.response.data.error;
    } else {
      throw error;
    }
  }
}

export async function updateAdmin(
  id: string,
  data: UpdateAdminData,
): Promise<AxiosResponse<any>> {
  return client.put(`${URL}/update/${id}`, data);
}

export async function deleteAdmin(id: string): Promise<AxiosResponse<any>> {
  return client.delete(`${URL}/delete/${id}`);
}

export async function logoutAdmin(): Promise<AxiosResponse<LogoutResponse>> {
  return client.post(`${URL}/logout`);
}

export async function getAllAdmins(): Promise<AxiosResponse<Admin[]>> {
  return client.get(`${URL}/getAllAdmins`);
}

export async function fetchAdmin(): Promise<AxiosResponse<Admin>> {
  return client.get(`${URL}/check-auth`);
}

export async function forgotAdminPassword(
  email: string,
  //meant to be any, either returns a message or error from response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<AxiosResponse<any>> {
  return await client.post(`${URL}/forgot-password`, { email });
}

export async function resetAdminPassword(
  token: string,
  newPassword: string,
  //meant to be any, either returns a message or error from response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<AxiosResponse<any>> {
  return await client.post(`${URL}/reset-password`, { token, newPassword });
}
