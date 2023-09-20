import { PrismaClient, Classroom, Prisma } from '@prisma/client';

export class ClassroomDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createClassroom(
    classroomData: Prisma.ClassroomCreateInput,
  ): Promise<Classroom> {
    return this.prismaClient.classroom.create({
      data: classroomData,
    });
  }

  public async getAllClassrooms(): Promise<Classroom[]> {
    return this.prismaClient.classroom.findMany();
  }

  public async getClassroomById(
    classroomId: string,
  ): Promise<Classroom | null> {
    return this.prismaClient.classroom.findUnique({
      where: { id: classroomId },
    });
  }

  public async getClassroomsByCentre(centreId: string): Promise<Classroom[]> {
    return this.prismaClient.classroom.findMany({
      where: { centreId: centreId },
    });
  }

  public async updateClassroom(
    classroomId: string,
    classroomData: Prisma.ClassroomUpdateInput,
  ): Promise<Classroom | null> {
    return this.prismaClient.classroom.update({
      where: { id: classroomId },
      data: classroomData,
    });
  }

  public async deleteClassroom(classroomId: string): Promise<Classroom | null> {
    return this.prismaClient.classroom.delete({
      where: { id: classroomId },
    });
  }
}
