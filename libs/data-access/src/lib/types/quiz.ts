import {
  QuizQuestionDifficultyEnum,
  QuizQuestionTopicEnum,
} from '../constants';
import { LevelEnum, SubjectEnum } from './CommonTypes';
import { QuizQuestionData } from './question';
import { TakeData } from './take';
import { z } from 'zod';
import { createQuizSchema, quizQuestionInQuizSchema } from '../schemas';

export interface QuizPaginationFilter {
  subjects?: SubjectEnum[];
  levels?: LevelEnum[];
  difficulty?: QuizQuestionDifficultyEnum[];
  topics?: QuizQuestionTopicEnum[];
  showLatestOnly?: boolean;
}

export interface QuizData {
  id: string;
  title: string;
  description: string;
  subject: SubjectEnum;
  levels: LevelEnum[];
  difficulty: QuizQuestionDifficultyEnum;
  topics: QuizQuestionTopicEnum[];
  totalMarks: Number;
  rewardPoints: Number;
  rewardMinimumMarks: Number;
  timeAllowed?: number;
  teacherCreatedId: string;
  teacherCreated: any;
  createdAt: string;
  nextVersionId: string;
  version: Number;
  allocatedTo: any;
  takes: TakeData[];
  quizQuestions: any;
}

export type CreateQuizType = z.infer<typeof createQuizSchema>;
export type QuizQuestionInQuizType = z.infer<typeof quizQuestionInQuizSchema>;
export type UpdateQuizParams = {
  quizId: string;
  data: CreateQuizType & { subject: SubjectEnum; teacherCreated: string };
};
