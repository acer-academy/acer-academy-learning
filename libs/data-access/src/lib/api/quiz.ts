import { SubjectEnum } from '@prisma/client';
import {
  CreateQuizType,
  QuizData,
  QuizPaginationFilter,
  UpdatePublishedQuizParams,
  UpdateQuizParams,
} from '../types/quiz';
import client from './client';
import { AxiosResponse } from 'axios';
import { Student } from '../types/student';
import {
  QuizQuestionDifficultyEnum,
  QuizQuestionTopicEnum,
} from '../constants';
import { LevelEnum } from '../types/CommonTypes';
import { QuizQuestionData } from '../types/question';

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

export async function createQuiz(
  data: CreateQuizType & { subject: SubjectEnum; teacherCreated: string },
) {
  return client.post(`${URL}`, data);
}

export async function updateQuiz({ quizId, data }: UpdateQuizParams) {
  return client.put(`${URL}/${quizId}`, data);
}

export async function updatePublishedQuiz({
  quizId,
  data,
}: UpdatePublishedQuizParams) {
  return client.put(`${URL}/published/${quizId}`, data);
}

export async function getQuizByQuizId(quizId: string): Promise<QuizData> {
  const res = await client.get(`${URL}/${quizId}`);
  // Extract student IDs
  res.data.allocatedTo = res.data.allocatedTo.map(
    ({ id }: Partial<Student>) => id,
  );
  return res.data;
}

export const getAdaptiveQuizQuestions = async (data: {
  topics: QuizQuestionTopicEnum[];
  studentId: string;
}): Promise<
  AxiosResponse<{
    totalQuestionCount: number;
    questions: QuizQuestionData[];
    thresholds: { [key in QuizQuestionDifficultyEnum]: number };
  }>
> => {
  // return client.post(`/quiz-questions/filter?=page${1}&pageSize=${1}`, data);
  const topics = data.topics
    .map((topic, index) => `${index !== 0 ? '&' : ''}topics=${topic}`)
    .join('');
  return client.get(
    `${URL}/generate-adaptive-learning-quiz/${data.studentId}?${topics}`,
  );
};
