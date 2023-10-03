import {
  CreateQuizQuestionType,
  QuizQuestionData,
  QuizQuestionPaginationFilter,
} from '../types/question';
import client from './client';
import { AxiosResponse } from 'axios';

const URL = '/quiz-questions';

export async function getPaginatedFilteredQuestions(
  page: Number,
  pageSize: Number,
  filterOptions: QuizQuestionPaginationFilter,
): Promise<
  AxiosResponse<{ questions: QuizQuestionData[]; totalCount: number }>
> {
  return client.post(
    `${URL}/filter?page=${page}&pageSize=${pageSize}`,
    filterOptions,
  );
}

export const createQuestion = async (
  data: CreateQuizQuestionType,
): Promise<AxiosResponse<QuizQuestionData>> => {
  return client.post(`${URL}`, data);
};
