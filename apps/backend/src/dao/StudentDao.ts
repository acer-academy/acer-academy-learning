import { PrismaClient, Prisma, Student } from '@prisma/client';
// import { StudentPostData } from 'libs/data-access/src/lib/types/student';

class StudentDao {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createStudent(
    input: Prisma.StudentCreateInput,
  ): Promise<Student> {
    return this.prisma.student.create({
      data: {
        ...input,
      },
    });
  }

  public async getAllStudents(): Promise<Student[]> {
    return this.prisma.student.findMany();
  }

  async getStudentByEmail(email: string) {
    return this.prisma.student.findUnique({
      where: { email },
      include: {
        parents: true,
      },
    });
  }
}

export default new StudentDao();
