import { z } from 'zod';
import { LEX_DEFAULT_JSON_STRING } from '../constants';
import { LevelEnum } from '../types/CommonTypes';

const isValidURL = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const assignmentSchema = z.object({
  id: z.string(),
  title: z.string().min(4, 'Title must be at least 4 characters long'),
  description: z
    .string()
    .trim()
    .superRefine((description, ctx) => {
      if (!description || description === LEX_DEFAULT_JSON_STRING) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Assignment instructions cannot be left empty',
        });
      }
    }),
  levels: z
    .array(z.nativeEnum(LevelEnum))
    .min(1, 'You must select at least one level'),
  fileName: z.string().min(1, 'File name cannot be empty'),
  fileUrl: z.string().min(1, 'File URL cannot be empty').refine(isValidURL, {
    message: 'Invalid URL',
  }),
  totalMarks: z.number().positive('Total Marks must be a positive number'),
  dueDate: z.coerce.date().min(new Date(), 'Due date must be in the future'),
});

export const createAssignmentSchema = assignmentSchema.omit({ id: true });
