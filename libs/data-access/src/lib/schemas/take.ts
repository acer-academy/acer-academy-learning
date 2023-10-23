import { z } from 'zod';

export const createTakeAnswerApiSchema = z.object({
  questionId: z.string(),
  studentAnswer: z.string(),
  timeTaken: z.number().min(0, 'Time taken cannot be less than 0 seconds'),
});

export const createTakeApiSchema = z.object({
  takenById: z.string(),
  attemptedAt: z.date(),
  timeTaken: z.number().min(0, 'Time taken cannot be less than 0 second'),
  studentAnswers: z.array(createTakeAnswerApiSchema),
  quizId: z.string(),
});

export const createTakeAnswerSchema = z.intersection(
  createTakeAnswerApiSchema.omit({ studentAnswer: true }),
  z.object({
    studentAnswer: z.array(z.string().or(z.boolean())),
  }),
);

export const createTakeSchema = z.intersection(
  createTakeApiSchema.omit({ studentAnswers: true, takenById: true }),
  z.object({
    studentAnswers: z.array(createTakeAnswerSchema),
  }),
);
