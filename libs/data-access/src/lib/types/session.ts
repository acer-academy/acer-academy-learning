import { LevelEnum, SubjectEnum } from './CommonTypes';
import { ClassData } from './class';
import { ClassroomData } from './classroom';
import { StudentData } from './student';
import { TeacherData } from './teacher';

export interface SessionData {
  id: string;
  start: Date;
  end: Date;
  subjects: SubjectEnum[];
  levels: LevelEnum[];
  teacherId: string;
  classroomId: string;
  classId: string | null;
  students: StudentData[];
  teacher: TeacherData;
  classroom: ClassroomData;
  class: ClassData | null;
}

export interface SessionCreateData {
  start: Date;
  end: Date;
  subjects: SubjectEnum[];
  levels: LevelEnum[];
  teacherId: string;
  classroomId: string;
  classId: string | null;
}

export interface SessionUpdateData {
  start: Date;
  end: Date;
  subjects: SubjectEnum[];
  levels: LevelEnum[];
  teacherId: string;
  classroomId: string;
  classId?: string | null;
}
