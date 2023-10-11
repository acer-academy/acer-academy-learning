import { z } from 'zod';
import { LevelEnum, SubjectEnum } from '../types/CommonTypes';
import { LEX_DEFAULT_JSON_STRING } from '../constants';
import { QuizQuestionTopicEnum } from '@prisma/client';
import { createQuizQuestionSchema } from './question';
/**
 * - id : Long
- name : String
- subject : SubjectEnum 
- levels: LevelEnum[]
- difficulty : QuizQuestionDifficultyEnum[]
- topics: QuizQuestionTopicEnum[]
- totalMarks : Double 
- rewardPoints : Integer
- rewardMinimumMarks : Double
- timeAllowed: Longj
*/

export const quizSchema = z.object({
  id: z.string(),
  title: z.string().min(4, 'Quiz name must be at least 4 characters long'),
  description: z
    .string()
    .trim()
    .superRefine((description, ctx) => {
      if (!description || description === LEX_DEFAULT_JSON_STRING) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Description field cannot be left empty',
        });
      }
    }),
  subject: z.nativeEnum(SubjectEnum),
  levels: z.array(z.nativeEnum(LevelEnum)),
  topics: z.array(z.nativeEnum(QuizQuestionTopicEnum)),
  totalMarks: z.number().positive('Total Marks must be a positive number'),
  rewardPoints: z.number().positive('Reward Points must be a positive number'),
  // in seconds
  timeAllowed: z.number().int('Time allowed (in seconds must be an Integer'),
  questions: z.array(createQuizQuestionSchema),
});

export const createQuizSchema = quizSchema.omit({ id: true });
