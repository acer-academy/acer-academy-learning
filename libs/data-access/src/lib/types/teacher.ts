import { LevelEnum, SubjectEnum } from './enums';

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
