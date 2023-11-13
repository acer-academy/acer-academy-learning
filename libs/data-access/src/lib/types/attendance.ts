import { SessionData } from './session';
import { StudentData } from './student';

export interface AttendanceData {
  id: string;
  hasAttended: boolean;
  student: StudentData;
  session: SessionData;
}

export interface AttendanceCreateData {
  studentId: string;
  sessionId: string;
}
