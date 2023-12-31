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
  whitelistItemId: string;
}

export interface Teacher {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  levels: LevelEnum[];
  subjects: SubjectEnum[];
  centre?: Centre;
  isAuthenticated: boolean;
}

export interface RegisterTeacherData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  levels: LevelEnum[];
  subjects: SubjectEnum[];
  centreId: string;
}

export interface UpdateTeacherData {
  firstName?: string;
  lastName?: string;
  password?: string;
  subjects?: SubjectEnum[];
  levels?: LevelEnum[];
}
