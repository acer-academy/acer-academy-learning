import { PrismaClient, Student } from '@prisma/client';
import { StudentPostData } from 'libs/data-access/src/lib/types/student';

class StudentDao {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createStudent(input: StudentPostData): Promise<Student> {
    return this.prisma.student.create({
      data: {
        ...input,
      },
    });
  }
  public async getAllStudents(): Promise<Student[]> {
    return this.prisma.student.findMany();
  }
}

export default new StudentDao();
