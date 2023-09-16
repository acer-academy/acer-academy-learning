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
