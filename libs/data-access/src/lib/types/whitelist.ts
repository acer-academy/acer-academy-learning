import { Admin } from './admin';
import { Student } from './student';
import { TeacherData } from './teacher';

export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}
export interface WhitelistCreateData {
  email: string;
  role: Role;
}

export interface WhitelistData {
  id: string;
  email: string;
  role: Role;
  student?: Student;
  admin?: Admin;
  teacher?: TeacherData;
}
