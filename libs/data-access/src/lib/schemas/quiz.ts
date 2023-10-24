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
          message: 'Quiz instructions cannot be left empty',
        });
      }
    }),
  topics: z
    .array(z.nativeEnum(QuizQuestionTopicEnum))
    .min(1, 'You must select at least one topic'),
  levels: z
    .array(z.nativeEnum(LevelEnum))
    .min(1, 'You must select at least one level'),
  rewardPoints: z.number().positive('Reward Points must be a positive number'),
  // in seconds
  timeAllowed: z
    .number()
    .int('Time allowed (in seconds must be an Integer')
    .optional()
    .nullable(),
  quizQuestions: z
    .array(quizQuestionInQuizSchema)
    .min(1, 'You must add at least one question'),
  allocatedTo: z.array(z.string()),
  isPublic: z.boolean(),
});

const quizMarksSchema = z
  .object({
    totalMarks: z.number().positive('Total Marks must be a positive number'),
    rewardMinimumMarks: z
      .number()
      .min(0, 'Reward minimum marks must be a non-negative number'),
  })
  .superRefine(({ totalMarks, rewardMinimumMarks }, ctx) => {
    if (rewardMinimumMarks > totalMarks) {
      ctx.addIssue({
        path: ['rewardMinimumMarks'],
        code: z.ZodIssueCode.custom,
        message: `Minimum marks need to be less than Total Marks. Minimum: ${rewardMinimumMarks}, Total:${totalMarks}`,
      });
    }
  });

export const createQuizSchema = z.intersection(
  quizSchema.omit({ id: true }),
  quizMarksSchema,
);
