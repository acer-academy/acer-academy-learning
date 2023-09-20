import { LevelEnum, SubjectEnum, Centre } from './CommonTypes';

export interface Teacher {
  email: string;
  firstName: string;
  lastName: string;
  levels: LevelEnum[];
  subjects: SubjectEnum[];
  centre?: Centre;
  isAuthenticated: boolean;
}

export const defaultTeacher: Teacher = {
  firstName: '',
  lastName: '',
  email: '',
  levels: [],
  subjects: [],
  isAuthenticated: false,
};

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
