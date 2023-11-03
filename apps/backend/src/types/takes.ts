import { Take } from '@prisma/client';

export type AllTakesStudentParams = {
  studentId: string;
  quizId: string;
  startDate?: string;
  endDate?: string;
  select?: {
    [key in keyof Partial<Take>]: boolean;
  };
};
