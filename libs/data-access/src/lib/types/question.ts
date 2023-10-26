import { LevelEnum } from './CommonTypes';
import { z } from 'zod';
import { createQuizAnswerSchema, createQuizQuestionSchema } from '../schemas';
import {
  QuizQuestionDifficultyEnum,
  QuizQuestionStatusEnum,
  QuizQuestionTopicEnum,
  QuizQuestionTypeEnum,
} from '../constants';

export interface QuizAnswer {
  id: string;
  answer: string;
  isCorrect: boolean;
  explanation?: string;
  questionId?: string;
}

export interface QuizQuestionData {
  id: string;
  topics: QuizQuestionTopicEnum[];
  levels: LevelEnum[];
  difficulty: QuizQuestionDifficultyEnum;
  questionText: string;
  status: QuizQuestionStatusEnum;
  questionType: QuizQuestionTypeEnum;
  answers: QuizAnswer[];
  createdAt: Date;
  version: number;
}

export interface QuizQuestionPaginationFilter {
  difficulty?: QuizQuestionDifficultyEnum[];
  levels?: LevelEnum[];
  topics?: QuizQuestionTopicEnum[];
  status?: QuizQuestionStatusEnum[];
  questionType?: QuizQuestionTypeEnum[];
  showLatestOnly?: boolean;
}

export type CreateQuizAnswerType = z.infer<typeof createQuizAnswerSchema>;
export type CreateQuizQuestionType = z.infer<typeof createQuizQuestionSchema>;
export type UpdateQuizQuestionParams = {
  questionId: string;
  data: CreateQuizQuestionType;
};
