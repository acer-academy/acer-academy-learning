import { LevelEnum, SubjectEnum, Centre } from './CommonTypes';
export interface TeacherData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  levels: LevelEnum[];
  subjects: SubjectEnum[];
  centreId: string;
}

export interface Teacher {
  email: string;
  firstName: string;
  lastName: string;
  levels: LevelEnum[];
  subjects: SubjectEnum[];
  centre?: Centre;
  isAuthenticated: boolean;
}
