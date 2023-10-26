import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/quiz-statistics';

export async function getCorrectRateByQuestionId(
  questionId: string,
): Promise<AxiosResponse<string>> {
  return client.get(`${URL}/correctRate/${questionId}`);
}

export async function getAverageTimeTakenByQuestionId(
  questionId: string,
): Promise<AxiosResponse<string>> {
  return client.get(`${URL}/averageTime/${questionId}`);
}

export async function getSpiderChartForQuiz(
  takeId: string,
): Promise<AxiosResponse<{ subjectArr: string[]; averageScoreArr: number[] }>> {
  return client.get(`${URL}/spiderchart/${takeId}`);
}
