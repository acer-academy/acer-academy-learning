import { StudentTakeData, CreateTakeApiSchema, TakeData } from '../types/take';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/take';

export async function getTakesByStudent(
  studentId: string,
): Promise<AxiosResponse<StudentTakeData[]>> {
  return client.get(`${URL}/student/${studentId}`);
}
export const createTake = async (
  data: CreateTakeApiSchema,
): Promise<AxiosResponse<TakeData>> => {
  return client.post(`${URL}`, data);
};

export async function getTakeByTakeId(
  takeId: string,
): Promise<AxiosResponse<StudentTakeData>> {
  return client.get(`${URL}/${takeId}`);
}
