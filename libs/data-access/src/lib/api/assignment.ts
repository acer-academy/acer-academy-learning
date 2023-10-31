import { AssignmentCreateData, AssignmentData } from '../types/assignment';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/assignments';

export async function createAssignment(
  assignmentData: AssignmentCreateData,
): Promise<AxiosResponse<AssignmentData>> {
  return client.post(`${URL}`, assignmentData);
}

export async function getAllAssignments(): Promise<
  AxiosResponse<AssignmentData[]>
> {
  return client.get(`${URL}`);
}

export async function getAssignmentById(
  assignmentId: string,
): Promise<AxiosResponse<AssignmentData>> {
  return client.get(`${URL}/${assignmentId}`);
}

export async function updateAssignment(
  assignmentId: string,
  assignmentData: AssignmentCreateData,
): Promise<AxiosResponse<AssignmentData>> {
  return client.put(`${URL}/${assignmentId}`, assignmentData);
}

export async function deleteAssignment(
  assignmentId: string,
): Promise<AxiosResponse<AssignmentData>> {
  return client.delete(`${URL}/${assignmentId}`);
}
