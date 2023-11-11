import { AxiosResponse } from 'axios';
import client from './client';
import type { PointOptionsObject } from 'highcharts';
const URL = '/statistics';
export async function getSubjectWiseStatistics(): Promise<
  AxiosResponse<
    Array<number | [number | string, number | null] | null | PointOptionsObject>
  >
> {
  return client.get(`${URL}/subject-wise-student`);
}
