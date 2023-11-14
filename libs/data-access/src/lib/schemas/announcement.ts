import { z } from 'zod';
import { LEX_DEFAULT_JSON_STRING } from '../constants';
import { LevelEnum, SubjectEnum } from '../types/CommonTypes';

export const announcementSchema = z.object({
  id: z.string(),
  title: z.string().min(4, 'Title must be at least 4 characters long'),
  message: z
    .string()
    .trim()
    .superRefine((message, ctx) => {
      if (!message || message === LEX_DEFAULT_JSON_STRING) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Announcement instructions cannot be left empty',
        });
      }
    }),
  targetLevels: z
    .array(z.nativeEnum(LevelEnum))
    .min(1, 'You must select at least one level'),
  targetSubjects: z
    .array(z.nativeEnum(SubjectEnum))
    .min(1, 'You must select at least one subject'),
  targetCentres: z
    .array(z.string())
    .min(1, 'You must select at least one centre'),
  teacherId: z.string(),
});

export const createAnnouncementSchema = announcementSchema.omit({
  id: true,
  teacherId: true,
});
