import { SubjectEnum, Take } from '@prisma/client';

export type AllTakesStudentParams = {
  studentId: string;
  quizIds?: string[];
  subjects?: SubjectEnum[];
  startDate?: string;
  endDate?: string;
};
