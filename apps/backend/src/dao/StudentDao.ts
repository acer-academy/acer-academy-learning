import { PrismaClient, Prisma, Student } from '@prisma/client';

class StudentDao {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createStudent(
    input: Prisma.StudentUncheckedCreateInput,
  ): Promise<Student> {
    return this.prisma.student.create({
      data: { ...input },
    });
  }

  public async updateStudent(
    id: string,
    input: Prisma.StudentUpdateInput,
  ): Promise<Student> {
    return this.prisma.student.update({
      where: { id },
      data: {
        ...input,
      },
      include: {
        parents: true,
      },
    });
  }

  // soft delete student by setting status to INACTIVE
  public async deleteStudent(id: string): Promise<Student> {
    return this.prisma.student.update({
      where: { id },
      data: {
        status: 'INACTIVE',
      },
    });
  }
  public async getAllStudents(): Promise<Student[]> {
    return this.prisma.student.findMany({
      include: {
        parents: true,
        centre: true,
        notificationPreference: true,
      },
    });
  }

  public async getStudentById(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        parents: true,
        centre: true,
        notificationPreference: true,
      },
    });
  }

  public async getStudentByEmail(email: string) {
    return this.prisma.student.findUnique({
      where: { email },
      include: {
        parents: true,
        centre: true,
        notificationPreference: true,
      },
    });
  }

  // Parents
  public async updateParent(
    id: string,
    input: Prisma.ParentUpdateInput,
  ): Promise<Student> {
    const res = await this.prisma.parent.update({
      where: { id },
      data: {
        ...input,
      },
    });
    const stuId = res.studentId;
    return this.prisma.student.findUnique({
      where: { id: stuId },
      include: {
        parents: true,
        centre: true,
        notificationPreference: true,
      },
    });
  }
}

export default new StudentDao();
