import { TeacherData } from './teacher';
import { LevelEnum, SubjectEnum } from './CommonTypes';
import { AssignmentAttemptData } from './assignmentAttempt';

export interface AssignmentData {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  dueDate: Date;
  totalMarks: number;
  subject: SubjectEnum;
  levels: LevelEnum[];
  teacher: TeacherData;
  assignmentAttempts: AssignmentAttemptData[];
}

export interface AssignmentCreateData {
  title: string;
  description: string;
  fileUrl: string;
  dueDate: Date;
  totalMarks: number;
  subject: SubjectEnum;
  levels: LevelEnum[];
  teacherId: string;
}
