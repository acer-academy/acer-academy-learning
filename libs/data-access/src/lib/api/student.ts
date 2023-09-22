/* eslint-disable no-useless-catch */
import { LoginData } from '../types/CommonTypes';
import { Student, StudentPostData } from '../types/student';
import client from './client';
import axios, { AxiosResponse } from 'axios';

const URL = '/students';

export async function createStudent(
  data: StudentPostData,
): Promise<AxiosResponse<{ student: Student }>> {
  return client.post(`${URL}/create`, data);
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

// export async function loginStudent(): Promise<
//   AxiosResponse<{ students: StudentData[] }>
// > {
//   return client.get(`${URL}/getAllStudents`);
// }

export const loginStudent = async (data: LoginData): Promise<any> => {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/students/login`,
      data,
      { withCredentials: true }, // Add this line
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutStudent = async (): Promise<any> => {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/students/logout`,
      {},
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchStudent = async (): Promise<any> => {
  try {
    const response = await axios.get(
      'http://localhost:8000/api/v1/students/check-auth',
      { withCredentials: true },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
