import { AssignmentData } from './assignment';
import { Student } from './student';

export interface AssignmentAttemptData {
  id: string;
  submittedOn: Date;
  score: number;
  feedback: string;
  assignmentId: string;
  assignment: AssignmentData;
  studentId: string;
  student: Student;
}

export interface AssignmentAttemptCreateData {
  submittedOn: Date;
  score: number;
  feedback: string;
  assignmentId: string;
  studentId: string;
}
