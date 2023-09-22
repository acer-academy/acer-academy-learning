/* eslint-disable no-useless-catch */
import { LoginData } from '../types/CommonTypes';
import {
  RegisterTeacherData,
  TeacherData,
  UpdateTeacherData,
} from '../types/teacher';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/teachers';

export async function loginTeacher(
  data: LoginData,
): Promise<AxiosResponse<any>> {
  return client.post(`${URL}/login`, data);
}

export async function logoutTeacher(): Promise<AxiosResponse<any>> {
  return client.post(`${URL}/logout`);
}

export async function fetchTeacher(): Promise<AxiosResponse<any>> {
  return client.get(`${URL}/check-auth`);
}

export async function registerTeacher(
  data: RegisterTeacherData,
): Promise<AxiosResponse<any>> {
  try {
    return await client.post(`${URL}`, data);
  } catch (error) {
    throw error;
  }
}

export async function updateTeacher(
  id: string,
  data: UpdateTeacherData,
): Promise<AxiosResponse<any>> {
  try {
    return await client.put(`${URL}/${id}`, data);
  } catch (error) {
    throw error;
  }
}

export async function deleteTeacher(
  email: string,
): Promise<AxiosResponse<any>> {
  try {
    return await client.delete(`${URL}/delete/${email}`);
  } catch (error) {
    throw error;
  }
}

export async function getAllTeachers(): Promise<AxiosResponse<TeacherData[]>> {
  try {
    return await client.get(`${URL}`);
  } catch (error) {
    throw error;
  }
}
