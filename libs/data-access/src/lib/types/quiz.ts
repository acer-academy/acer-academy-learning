import { z } from 'zod';
import { createQuizSchema } from '../schemas';

export type CreateQuizType = z.infer<typeof createQuizSchema>;
