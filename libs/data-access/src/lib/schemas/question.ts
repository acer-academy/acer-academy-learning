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
  isCorrect: z.boolean(),
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

const questionAnswerValidateSchema = z
  .object({
    questionType: z.nativeEnum(QuizQuestionTypeEnum),
    answers: z
      .array(createQuizAnswerSchema)
      .min(2, 'You must have at least 2 answers')
      .superRefine((answers, ctx) => {
        const explored = new Set<string>();
        answers.forEach((answer) => {
          if (explored.has(answer.answer.trim())) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Duplicate answers are not allowed.',
            });
          }
          explored.add(answer.answer.trim());
        });
      }),
  })
  .superRefine(({ questionType, answers }, ctx) => {
    const correctCount = answers.filter((ans) => ans.isCorrect).length;
    if (
      questionType === QuizQuestionTypeEnum.MCQ ||
      (questionType === QuizQuestionTypeEnum.TFQ && correctCount !== 1)
    ) {
      ctx.addIssue({
        path: ['answers'],
        code: z.ZodIssueCode.custom,
        message: `Not allowed to have more than 1 correct answer for ${questionType}`,
      });
    }
  });

// Have to use intersection for validate messages to work
export const createQuizQuestionSchema = z.intersection(
  quizQuestionSchema.omit({ questionType: true }),
  questionAnswerValidateSchema,
);
