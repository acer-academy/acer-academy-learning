import { Prisma, PrismaClient, Take } from '@prisma/client';

export class TakeDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createTake(takeData: Prisma.TakeCreateInput): Promise<Take> {
    return this.prismaClient.take.create({
      data: takeData,
      include: {
        studentAnswers: true,
      },
    });
  }

  public async getAllTakes(): Promise<Take[]> {
    return this.prismaClient.take.findMany({
      include: {
        studentAnswers: true,
      },
    });
  }

  public async getTakeById(takeId: string): Promise<Take | null> {
    return this.prismaClient.take.findUnique({
      where: { id: takeId },
      include: {
        studentAnswers: true,
      },
    });
  }

  public async getTakesByStudent(studentId: string): Promise<Take[]> {
    return this.prismaClient.take.findMany({
      where: {
        takenById: studentId,
      },
      include: {
        studentAnswers: true,
      },
    });
  }

  public async updateTake(
    takeId: string,
    takeData: Prisma.TakeUpdateInput,
  ): Promise<Take | null> {
    return this.prismaClient.take.update({
      where: { id: takeId },
      data: takeData,
      include: {
        studentAnswers: true,
      },
    });
  }

  public async deleteTake(takeId: string): Promise<Take | null> {
    return this.prismaClient.take.delete({
      where: { id: takeId },
      include: {
        studentAnswers: true,
      },
    });
  }
}
