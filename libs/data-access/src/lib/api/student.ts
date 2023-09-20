import { LoginData } from '../types/CommonTypes';
import { StudentData, StudentPostData } from '../types/student';
import client from './client';
import axios, { AxiosResponse } from 'axios';

const URL = '/students';

export async function createStudent(
  data: StudentPostData,
): Promise<AxiosResponse<{ student: StudentData }>> {
  return client.post(`${URL}/create`, data);
}

export async function getAllStudents(): Promise<
  AxiosResponse<{ students: StudentData[] }>
> {
  return client.get(`${URL}/getAllStudents`);
}

// export async function loginStudent(): Promise<
//   AxiosResponse<{ students: StudentData[] }>
// > {
//   return client.get(`${URL}/getAllStudents`);
// }

export const loginStudent = async (data: LoginData): Promise<any> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/students/login`,
      data,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
