import {
  PrismaClient,
  Teacher,
  Prisma,
  SubjectEnum,
  LevelEnum,
} from '@prisma/client';

export class TeacherDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createTeacher(
    teacherData: Prisma.TeacherCreateInput,
  ): Promise<Teacher> {
    return this.prismaClient.teacher.create({
      data: teacherData,
    });
  }

  public async getAllTeachers(): Promise<Teacher[]> {
    return this.prismaClient.teacher.findMany();
  }

  // public async getTeacherById(teacherId: string): Promise<Teacher | null> {
  //   return this.prismaClient.teacher.findUnique({
  //     where: { id: teacherId },
  //   });
  // }

  //getTeacherByID implementation
  public async getTeacherById(teacherId: string): Promise<Teacher | null> {
    return this.prismaClient.teacher.findUnique({
      where: { id: teacherId },
      include: {
        centre: true,
      },
    });
  }

  //removed Promise<Teacher> so that I can obtain the centre object first
  public async getTeacherByEmail(teacherEmail: string) {
    return this.prismaClient.teacher.findFirst({
      where: { email: teacherEmail },
      include: {
        centre: true,
      },
    });
  }

  public async getTeachersByCentre(centreId: string): Promise<Teacher[]> {
    return this.prismaClient.teacher.findMany({
      where: { centreId: centreId },
    });
  }

  public async getTeachersBySubject(subject: SubjectEnum): Promise<Teacher[]> {
    return this.prismaClient.teacher.findMany({
      where: {
        subjects: { has: subject },
      },
    });
  }

  public async getTeachersByLevel(level: LevelEnum): Promise<Teacher[]> {
    return this.prismaClient.teacher.findMany({
      where: {
        levels: { has: level },
      },
    });
  }

  public async updateTeacher(
    teacherId: string,
    teacherData: Prisma.TeacherUpdateInput,
  ): Promise<Teacher | null> {
    return this.prismaClient.teacher.update({
      where: { id: teacherId },
      data: teacherData,
    });
  }

  public async deleteTeacher(teacherId: string): Promise<Teacher | null> {
    return this.prismaClient.teacher.delete({
      where: { id: teacherId },
    });
  }
}
