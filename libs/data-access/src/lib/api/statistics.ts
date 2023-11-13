import { AxiosResponse } from 'axios';
import client from './client';
import type { PointOptionsObject } from 'highcharts';
import { QuizQuestionTopicEnum } from '../constants';
import { SubjectEnum } from '../types/CommonTypes';
const URL = '/statistics';
export async function getSubjectWiseStatistics(data: {
  topics?: QuizQuestionTopicEnum[];
  subject: SubjectEnum;
}): Promise<
  AxiosResponse<{
    subject: Array<
      number | [number | string, number | null] | null | PointOptionsObject
    >;
    [key: string]: Array<
      number | [number | string, number | null] | null | PointOptionsObject
    >;
  }>
> {
  const topicsQuery = data.topics?.join('&topics=');
  return client.get(
    `${URL}/subject-wise-student/${data.subject}?topics=${topicsQuery}`,
  );
}
