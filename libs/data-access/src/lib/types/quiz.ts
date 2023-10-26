import {
  QuizQuestionDifficultyEnum,
  QuizQuestionTopicEnum,
} from '../constants';
import { LevelEnum, SubjectEnum } from './CommonTypes';
import { QuizQuestionData } from './question';
import { TakeData } from './take';
import { z } from 'zod';
import { createQuizSchema, quizQuestionInQuizSchema } from '../schemas';
import { Teacher } from './teacher';

export interface QuizPaginationFilter {
  subjects?: SubjectEnum[];
  levels?: LevelEnum[];
  difficulty?: QuizQuestionDifficultyEnum[];
  topics?: QuizQuestionTopicEnum[];
  showLatestOnly?: boolean;
}

export type QuizDataQuizQuestion = {
  quizId: string;
  quizQuestion: QuizQuestionData;
  quizQuestionId: string;
  quizQuestionIndex: number;
  quizQuestionMarks: number;
};

export interface QuizData {
  id: string;
  title: string;
  description: string;
  subject: SubjectEnum;
  levels: LevelEnum[];
  difficulty: QuizQuestionDifficultyEnum;
  topics: QuizQuestionTopicEnum[];
  totalMarks: number;
  rewardPoints: number;
  rewardMinimumMarks: number;
  timeAllowed?: number;
  teacherCreatedId: string;
  teacherCreated: Partial<Teacher>;
  createdAt: string;
  nextVersionId: string;
  version: number;
  allocatedTo: any;
  isPublic: boolean;
  takes: TakeData[];
  quizQuestions: QuizDataQuizQuestion[];
}

export type CreateQuizType = z.infer<typeof createQuizSchema>;

export type QuizQuestionInQuizType = z.infer<typeof quizQuestionInQuizSchema>;

export type UpdateQuizParams = {
  quizId: string;
  data: CreateQuizType & { subject: SubjectEnum; teacherCreated: string };
};
export type UpdatePublishedQuizParams = {
  quizId: string;
  data: CreateQuizType & {
    subject: SubjectEnum;
    teacherCreated: string;
    oldQuestionId: string;
    newQuestionId: string;
  };
};
