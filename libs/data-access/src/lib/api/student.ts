/* eslint-disable no-useless-catch */
import { LoginData } from '../types/CommonTypes';
import { Student, StudentPostData, UpdateStudentData } from '../types/student';
import client from './client';
import { AxiosResponse } from 'axios';

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

export async function loginStudent(
  data: LoginData,
): Promise<AxiosResponse<any>> {
  return client.post(`${URL}/login`, data);
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
  return await client.put(`${URL}/update/${email}`, data);
}

export async function deleteStudent(
  email: string,
): Promise<AxiosResponse<any>> {
  return await client.delete(`${URL}/delete/${email}`);
}
