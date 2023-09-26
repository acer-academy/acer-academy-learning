/* eslint-disable no-useless-catch */
import { LoginData } from '../types/CommonTypes';
import {
  Student,
  StudentPostData,
  UpdateParentData,
  UpdateStudentData,
} from '../types/student';
import client from './client';
import axios, { AxiosResponse } from 'axios';

const URL = '/students';

export async function createStudent(
  data: StudentPostData,
): Promise<AxiosResponse<{ student: Student }>> {
  try {
    const response: AxiosResponse<{ student: Student }> = await client.post(
      `${URL}/create`,
      data,
    );
    return response;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      // console.error('Error registering admin:', error.response.data);
      throw error.response.data.error;
    } else {
      throw error;
    }
  }
}

export async function getAllStudents(): Promise<
  AxiosResponse<{ students: Student[] }>
> {
  return client.get(`${URL}/getAllStudents`);
}

export async function getStudentById(
  studentId: string,
): Promise<AxiosResponse<{ student: Student }>> {
  return client.get(`${URL}/getStudentById/${studentId}`);
}

export async function loginStudent(
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
      error.response.status === 400
    ) {
      throw error.response.data.error;
    } else {
      throw error;
    }
  }

  // return client.post(`${URL}/login`, data);
}

export async function logoutStudent(): Promise<AxiosResponse<any>> {
  return client.post(`${URL}/logout`);
}

export async function fetchStudent(): Promise<AxiosResponse<any>> {
  return client.get(`${URL}/check-auth`);
}

export async function updateStudent(
  email: string,
  data: UpdateStudentData,
): Promise<AxiosResponse<any>> {
  return (await client.put(`${URL}/update/${email}`, data)).data;
}

export async function deleteStudent(
  email: string,
): Promise<AxiosResponse<any>> {
  return await client.delete(`${URL}/delete/${email}`);
}

export const updateParent = async (
  id: string,
  data: UpdateParentData,
): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await client.put(`${URL}/update-parent/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteParent = async (id: string): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await client.delete(`${URL}/delete-parent/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
