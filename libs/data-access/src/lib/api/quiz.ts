import { QuizData, QuizPaginationFilter } from '../types/quiz';
import client from './client';
import { Axios, AxiosResponse } from 'axios';

const URL = '/quiz';

export async function getPaginatedFilteredQuizzes(
  page: Number,
  pageSize: Number,
  filterOptions: QuizPaginationFilter,
): Promise<AxiosResponse<{ quizzes: QuizData[]; totalCount: number }>> {
  return client.post(
    `${URL}/filter?page=${page}&pageSize=${pageSize}`,
    filterOptions,
  );
}

export async function deleteQuiz(quizId: string): Promise<void> {
  return client.delete(`${URL}/${quizId}`);
}
