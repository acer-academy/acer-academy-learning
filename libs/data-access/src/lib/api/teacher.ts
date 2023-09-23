/* eslint-disable no-useless-catch */
import { LoginData } from '../types/CommonTypes';
import {
  RegisterTeacherData,
  Teacher,
  TeacherData,
  UpdateTeacherData,
} from '../types/teacher';
import client from './client';
import axios, { AxiosResponse } from 'axios';

const URL = '/teachers';

export async function loginTeacher(
  data: LoginData,
): Promise<AxiosResponse<any>> {
  try {
    const response: AxiosResponse<any> = await client.post(
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

  // return client.post(`${URL}/login`, data);
}

// export async function loginTeacher(
//   data: LoginData,
// ): Promise<AxiosResponse<any>> {
//   return client.post(`${URL}/login`, data);
// }

export async function logoutTeacher(): Promise<AxiosResponse<any>> {
  return client.post(`${URL}/logout`);
}

export async function fetchTeacher(): Promise<AxiosResponse<any>> {
  return client.get(`${URL}/check-auth`);
}

// export async function registerTeacher(
//   data: RegisterTeacherData,
// ): Promise<AxiosResponse<any>> {
//   try {
//     return await client.post(`${URL}`, data);
//   } catch (error) {
//     throw error;
//   }
// }

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
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 500
    ) {
      // console.error('Error registering admin:', error.response.data);
      throw error.response.data.error;
    } else {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 400
      ) {
        throw error.response.data.error;
      }
    }
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
