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
