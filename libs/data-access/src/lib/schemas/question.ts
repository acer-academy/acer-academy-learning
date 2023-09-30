import { z } from 'zod';
import {
  QuizQuestionDifficultyEnum,
  QuizQuestionStatusEnum,
  QuizQuestionTopicEnum,
  QuizQuestionTypeEnum,
} from '../constants/question';
import { LevelEnum } from '../types/CommonTypes';
import { stripHtml } from 'string-strip-html';

// FE schemas
export const quizAnswerSchema = z.object({
  id: z.string(),
  answer: z
    .string()
    .trim()
    .superRefine((answer, ctx) => {
      if (answer && stripHtml(answer).result.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Answer field cannot be left empty.',
        });
      }
    }),
  explanation: z.string().trim().optional(),
});

export const createQuizAnswerSchema = quizAnswerSchema.omit({ id: true });

export const retrieveQuizQuestionSchema = quizAnswerSchema.extend({
  questionId: z.string(),
});

export const quizQuestionSchema = z.object({
  // options: z.array(z.string().trim().min(1, 'Option cannot be empty.')).min(2, 'You must have at least 2 options.'),
  topics: z
    .array(z.nativeEnum(QuizQuestionTopicEnum))
    .min(1, 'You must select at least one topic'),
  levels: z
    .array(z.nativeEnum(LevelEnum))
    .min(1, 'You must select at least one subject'),
  difficulty: z.nativeEnum(QuizQuestionDifficultyEnum),
  questionText: z
    .string()
    .trim()
    .superRefine((questionText, ctx) => {
      if (questionText && stripHtml(questionText).result.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Question text is required.',
        });
      }
    }),
  status: z.nativeEnum(QuizQuestionStatusEnum),
  questionType: z.nativeEnum(QuizQuestionTypeEnum),
});

export const createQuizQuestionSchema = quizQuestionSchema.extend({
  answers: z
    .array(createQuizAnswerSchema)
    .min(2, 'You must have at least 2 answers'),
});
