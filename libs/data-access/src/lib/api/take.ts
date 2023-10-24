import { StudentTakeData } from '../types/take';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/take';

export async function getTakesByStudent(
  studentId: string,
): Promise<AxiosResponse<StudentTakeData[]>> {
  return client.get(`${URL}/student/${studentId}`);
}
