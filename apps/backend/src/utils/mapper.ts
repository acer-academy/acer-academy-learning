import { Student as PrismaStudent } from '@prisma/client';
import {
  StudentData,
  StudentStatus,
} from 'libs/data-access/src/lib/types/student';

// This file maps the Prisma Student type (backend) to the StudentData type (frontend)
export function mapPrismaStudentToStudentData(
  prismaStudent: PrismaStudent,
): StudentData {
  return {
    id: prismaStudent.id,
    name: prismaStudent.name,
    email: prismaStudent.email,
    status: prismaStudent.status as StudentStatus,
  };
}
