import { ConsolidatedAssignmentStatistics } from '../types/statistics';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/assignments/statistics';

export async function getAssignmentStatisticsByAssignmentId(
  assignmentId: string,
): Promise<AxiosResponse<ConsolidatedAssignmentStatistics>> {
  return client.get(`${URL}/${assignmentId}`);
}
