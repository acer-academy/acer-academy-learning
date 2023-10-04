/* eslint-disable no-useless-catch */
import { LoginData, LogoutResponse } from '../types/CommonTypes';
import {
  RegisterTeacherData,
  TeacherData,
  UpdateTeacherData,
} from '../types/teacher';
import client from './client';
import axios, { AxiosResponse } from 'axios';

const URL = '/teachers';

export async function loginTeacher(
  data: LoginData,
): Promise<AxiosResponse<Teacher>> {
  try {
    const response: AxiosResponse<Teacher> = await client.post(
      `${URL}/login`,
      data,
    );
    return response;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 500
    ) {
      throw error.response.data.error;
    } else {
      throw error;
    }
  }
}

export async function logoutTeacher(): Promise<AxiosResponse<LogoutResponse>> {
  return client.post(`${URL}/logout`);
}

export async function fetchTeacher(): Promise<AxiosResponse<Teacher>> {
  return client.get(`${URL}/check-auth`);
}

export async function registerTeacher(
  data: RegisterTeacherData,
): Promise<AxiosResponse<TeacherData>> {
  try {
    const response: AxiosResponse<TeacherData> = await client.post(
      `${URL}`,
      data,
    );

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 500 || error.response.status === 400) {
        throw error.response.data.error;
      }
    }
    // For any other error or if error.response is undefined, throw a generic error
    throw new Error('An error occurred while registering the teacher');
  }
}

export async function updateTeacher(
  id: string,
  data: UpdateTeacherData,
): Promise<AxiosResponse<TeacherData>> {
  try {
    return await client.put(`${URL}/${id}`, data);
  } catch (error) {
    throw error;
  }
}

export async function deleteTeacher(
  teacherId: string,
): Promise<AxiosResponse<any>> {
  try {
    return await client.delete(`${URL}/${teacherId}`);
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

export async function forgotTeacherPassword(
  email: string,
  //meant to be any, either returns a message or error from response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<AxiosResponse<any>> {
  return await client.post(`${URL}/forgot-password`, { email });
}

export async function resetTeacherPassword(
  token: string,
  newPassword: string,
  //meant to be any, either returns a message or error from response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<AxiosResponse<any>> {
  return await client.post(`${URL}/reset-password`, { token, newPassword });
}
