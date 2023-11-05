import { QuizQuestionTopicEnum } from '@prisma/client';
import {
  ConsolidatedQuizStatistics,
  SpiderChartResponse,
  StudentStatisticsQuizFormat,
} from '../types/statistics';
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

export async function getQuizStatisticsByQuizId(
  quizId: string,
): Promise<AxiosResponse<ConsolidatedQuizStatistics>> {
  return client.get(`${URL}/quiz/${quizId}`);
}

export async function getQuizStatisticsForStudent(data: {
  quizId: string;
  startDate?: string;
  endDate?: string;
}): Promise<AxiosResponse<StudentStatisticsQuizFormat>> {
  const startDate = data.startDate;
  const startDateQuery = startDate ? `startDate=${startDate}` : '';
  const endDate = data.endDate;
  const endDateQuery = endDate ? `endDate=${endDate}` : '';
  return client.get(
    `${URL}/student-quizzes/${data.quizId}?${startDateQuery}&${endDateQuery}`,
  );
}

export async function getOverallSpiderChartForStudent(data: {
  topics?: QuizQuestionTopicEnum[];
}): Promise<AxiosResponse<SpiderChartResponse>> {
  // format
  const topicsQuery = data.topics?.join('&topics=');

  return client.get(`${URL}/spider-chart-student?topics=${topicsQuery}`);
}
