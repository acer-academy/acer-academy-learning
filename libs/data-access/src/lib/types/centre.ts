import { TeacherData } from './teacher';

export interface CentreCreateData {
  name: string;
  address: string;
}

export interface CentreUpdateData {
  name: string;
  address: string;
}

export interface CentreData {
  id: string;
  name: string;
  address: string;
  teachers: TeacherData[];
}
