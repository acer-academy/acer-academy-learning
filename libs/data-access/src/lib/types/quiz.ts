import { z } from 'zod';
import { createQuizSchema, quizQuestionInQuizSchema } from '../schemas';

export type CreateQuizType = z.infer<typeof createQuizSchema>;

export type QuizQuestionInQuizType = z.infer<typeof quizQuestionInQuizSchema>;
