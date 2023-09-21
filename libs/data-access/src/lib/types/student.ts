import { LevelEnum, SubjectEnum } from './CommonTypes';
import { Teacher } from './teacher';
// import { Centre } from './CommonTypes';

export interface Centre {
  id: string;
  name: string;
  address: string;
  students?: Student[];
  teachers?: Teacher[];
}

export enum StudentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}
export interface StudentPostData {
  name: string;
  email: string;
}

export interface StudentData {
  id: string;
  name: string;
  email: string;
  status: StudentStatus;
}

export interface Parent {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Student {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  school: string;
  level: LevelEnum[];
  subjects: SubjectEnum[];
  centre?: Centre;
  parents: Parent[];
  isAuthenticated: boolean;
}
