import { controlOrMeta } from 'lexical/LexicalUtils';
import {
  CreateQuizQuestionType,
  QuizQuestionData,
  QuizQuestionPaginationFilter,
  UpdateQuizQuestionParams,
} from '../types/question';
import client from './client';
import { Axios, AxiosResponse } from 'axios';

const URL = '/quiz-questions';

export async function getFilteredQuestions(
  filterOptions: QuizQuestionPaginationFilter,
): Promise<
  AxiosResponse<{ questions: QuizQuestionData[]; totalCount: number }>
> {
  return client.post(`${URL}/filter`, filterOptions);
}

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

export const getFilteredQuestions = async (
  filterOptions: QuizQuestionPaginationFilter,
): Promise<
  AxiosResponse<{ questions: QuizQuestionData[]; totalCount: number }>
> => {
  return client.post(`${URL}/filter`, filterOptions);
};

export const createQuestion = async (
  data: CreateQuizQuestionType,
): Promise<AxiosResponse<QuizQuestionData>> => {
  return client.post(`${URL}`, data);
};

export const getQuizQuestionById = async (
  questionId: string,
): Promise<QuizQuestionData> => {
  const res = await client.get(`${URL}/${questionId}`);
  return res.data;
};

export const updateQuizQuestion = async ({
  questionId,
  data,
}: UpdateQuizQuestionParams): Promise<QuizQuestionData> => {
  const res = await client.put(`${URL}/${questionId}`, data);
  console.log(res);
  return res.data;
};

export const deleteQuizQuestion = async (questionId: string): Promise<void> => {
  return client.delete(`${URL}/${questionId}`);
};
