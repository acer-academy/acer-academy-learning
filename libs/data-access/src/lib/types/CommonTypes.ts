// CommonTypes.ts
import { Student } from './student';
import { Teacher } from './teacher';

export enum LevelEnum {
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
  P4 = 'P4',
  P5 = 'P5',
  P6 = 'P6',
  S1 = 'S1',
  S2 = 'S2',
  S3 = 'S3',
  S4 = 'S4',
  S5 = 'S5',
  J1 = 'J1',
  J2 = 'J2',
}

export enum SubjectEnum {
  MATHEMATICS = 'MATHEMATICS',
  ENGLISH = 'ENGLISH',
  SCIENCE = 'SCIENCE',
}

export enum AdminType {
  SUPER_ADMIN = 'super',
  STANDARD_ADMIN = 'standard',
}

export interface Centre {
  id: string;
  name: string;
  address: string;
  students?: Student[];
  teachers?: Teacher[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LogoutResponse {
  message: string;
}

export enum PromotionStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum StudentStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

export enum StripeTransactionStatus {
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  VOID = 'VOID',
  REFUNDED = 'REFUNDED',
}

// Other shared types and enums...
