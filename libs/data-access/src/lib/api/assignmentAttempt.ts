import {
  AssignmentAttemptCreateData,
  AssignmentAttemptData,
} from '../types/assignmentAttempt';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/assignment-attempts';

export async function createAssignmentAttempt(
  assignmentAttemptData: AssignmentAttemptCreateData,
): Promise<AxiosResponse<AssignmentAttemptData>> {
  return client.post(`${URL}`, assignmentAttemptData);
}

export async function getAllAssignmentAttempts(): Promise<
  AxiosResponse<AssignmentAttemptData[]>
> {
  return client.get(`${URL}`);
}

export async function getAssignmentAttemptById(
  assignmentAttemptId: string,
): Promise<AxiosResponse<AssignmentAttemptData>> {
  return client.get(`${URL}/${assignmentAttemptId}`);
}

export async function updateAssignmentAttempt(
  assignmentAttemptId: string,
  assignmentAttemptData: AssignmentAttemptCreateData,
): Promise<AxiosResponse<AssignmentAttemptData>> {
  return client.put(`${URL}/${assignmentAttemptId}`, assignmentAttemptData);
}

export async function deleteAssignmentAttempt(
  assignmentAttemptId: string,
): Promise<AxiosResponse<AssignmentAttemptData>> {
  return client.delete(`${URL}/${assignmentAttemptId}`);
}
