import { StudentData, StudentPostData } from '../types/student';
import client from './client';
import { AxiosResponse } from 'axios';

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
