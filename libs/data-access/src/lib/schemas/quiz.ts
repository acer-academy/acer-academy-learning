import { z } from 'zod';
import { LevelEnum, SubjectEnum } from '../types/CommonTypes';
import { LEX_DEFAULT_JSON_STRING } from '../constants';
import { QuizQuestionTopicEnum } from '@prisma/client';
import { quizQuestionInQuizSchema } from './question';
export const quizSchema = z.object({
  id: z.string(),
  title: z.string().min(4, 'Title must be at least 4 characters long'),
  description: z
    .string()
    .trim()
    .superRefine((description, ctx) => {
      if (!description || description === LEX_DEFAULT_JSON_STRING) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Description cannot be left empty',
        });
      }
    }),
  subject: z.nativeEnum(SubjectEnum),
  topics: z
    .array(z.nativeEnum(QuizQuestionTopicEnum))
    .min(1, 'You must select at least one topic'),
  levels: z
    .array(z.nativeEnum(LevelEnum))
    .min(1, 'You must select at least one level'),
  totalMarks: z.number().positive('Total Marks must be a positive number'),
  rewardPoints: z.number().positive('Reward Points must be a positive number'),
  // in seconds
  timeAllowed: z
    .number()
    .int('Time allowed (in seconds must be an Integer')
    .optional()
    .nullable(),
  questions: z
    .array(quizQuestionInQuizSchema)
    .min(1, 'You must add at least one question'),
});

export const createQuizSchema = quizSchema.omit({ id: true });
