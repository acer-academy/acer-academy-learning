import { TeacherData } from './teacher';
import { LevelEnum, SubjectEnum } from './CommonTypes';
import { AssignmentAttemptData } from './assignmentAttempt';
import { z } from 'zod';
import { createAssignmentSchema } from '../schemas/assignment';

export interface AssignmentData {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  dueDate: Date;
  totalMarks: number;
  subject: SubjectEnum;
  levels: LevelEnum[];
  teacher: TeacherData;
  assignmentAttempts: AssignmentAttemptData[];
}

export type CreateAssignmentType = z.infer<typeof createAssignmentSchema>;
