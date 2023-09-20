import { ClassroomData } from '../types/classroom';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/classrooms';

export async function getClassroomsByCentre(
  centreId: string,
): Promise<AxiosResponse<ClassroomData[]>> {
  return client.get(`${URL}/centre/${centreId}`);
}
