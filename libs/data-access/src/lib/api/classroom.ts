import { ClassroomCreateData, ClassroomData } from '../types/classroom';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/classrooms';

export async function createClassroom(
  classroomData: ClassroomCreateData,
): Promise<AxiosResponse<ClassroomData>> {
  return client.post(`${URL}`, classroomData);
}

export async function getClassroomsByCentre(
  centreId: string,
): Promise<AxiosResponse<ClassroomData[]>> {
  return client.get(`${URL}/centre/${centreId}`);
}

export async function updateClassroom(
  classroomId: string,
  classroomData: ClassroomCreateData,
): Promise<AxiosResponse<ClassroomData>> {
  return client.put(`${URL}/${classroomId}`, classroomData);
}

export async function deleteClassroom(
  classroomId: string,
): Promise<AxiosResponse<ClassroomData>> {
  return client.delete(`${URL}/${classroomId}`);
}
