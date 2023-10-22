import { z } from 'zod';

export const createTakeAnswerSchema = z.object({
  questionId: z.string(),
  studentAnswer: z.array(z.string()),
  timeTaken: z.number().min(0, 'Time taken cannot be less than 0 seconds'),
});

export const createTakeSchema = z.object({
  attemptedAt: z.date(),
  timeTaken: z.number().min(0, 'Time taken cannot be less than 0 second'),
  studentAnswers: z.array(createTakeAnswerSchema).min(1),
  quizId: z.string(),
});
