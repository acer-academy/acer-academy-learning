import { AxiosResponse } from 'axios';
import client from './client';
import { LoginData } from '../types/CommonTypes';

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
): Promise<AxiosResponse<any>> {
  return client.post(`${URL}/register`, data);
}

export async function loginAdmin(data: LoginData): Promise<AxiosResponse<any>> {
  return client.post(`${URL}/login`, data);
}

export async function updateAdmin(
  id: string,
  data: UpdateAdminData,
): Promise<AxiosResponse<any>> {
  return client.put(`${URL}/update/${id}`, data);
}

export async function deleteAdmin(email: string): Promise<AxiosResponse<any>> {
  return client.delete(`${URL}/delete/${email}`);
}

export async function logoutAdmin(): Promise<AxiosResponse<any>> {
  return client.post(`${URL}/logout`);
}

export async function fetchAdmin(): Promise<AxiosResponse<any>> {
  return client.get(`${URL}/check-auth`);
}

export async function forgotAdminPassword(
  email: string,
): Promise<AxiosResponse<any>> {
  return await client.post(`${URL}/forgot-password`, { email });
}

export async function resetAdminPassword(
  token: string,
  newPassword: string,
): Promise<AxiosResponse<any>> {
  return await client.post(`${URL}/reset-password`, { token, newPassword });
}
