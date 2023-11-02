export interface AssignmentAttemptData {
  id: string;
  submittedOn: Date;
  score: number;
  feedback: string;
  assignmentId: string;
  studentId: string;
}

export interface AssignmentAttemptCreateData {
  submittedOn: Date;
  score: number;
  feedback: string;
  assignmentId: string;
  studentId: string;
}
