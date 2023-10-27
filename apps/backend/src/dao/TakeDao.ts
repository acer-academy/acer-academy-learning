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
        studentAnswers: {
          include: { question: { include: { answers: true } } },
        },
        quiz: { select: { totalMarks: true } },
      },
    });
  }

  public async getTakeById(takeId: string): Promise<Take | null> {
    return this.prismaClient.take.findUnique({
      where: { id: takeId },
      include: {
        studentAnswers: {
          include: { question: { include: { answers: true } } },
        },
        quiz: { include: { quizQuestions: true } },
      },
    });
  }

  public async getTakesByStudent(studentId: string): Promise<Take[]> {
    return this.prismaClient.take.findMany({
      where: {
        takenById: studentId,
      },
      include: {
        studentAnswers: {
          include: { question: { include: { answers: true } } },
        },
        quiz: {
          include: { quizQuestions: true },
        },
      },
    });
  }

  public async getTakesByQuiz(quizId: string): Promise<Take[]> {
    return this.prismaClient.take.findMany({
      where: {
        quizId: quizId,
      },
      include: {
        studentAnswers: {
          include: { question: { include: { answers: true } } },
        },
        quiz: { select: { totalMarks: true } },
      },
    });
  }

  public async getFilteredTakes(
    filterOptions: Prisma.TakeWhereInput,
    offset: number,
    pageSize: number,
  ): Promise<Take[]> {
    return this.prismaClient.take.findMany({
      where: filterOptions,
      skip: offset,
      take: pageSize,
      orderBy: { attemptedAt: 'desc' },
    });
  }

  public async getTotalCountOfFilteredTakes(
    filterOptions: Prisma.TakeWhereInput,
  ): Promise<number> {
    return this.prismaClient.take.count({
      where: filterOptions,
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
        quiz: { select: { totalMarks: true } },
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

  public async deleteTakeAndAssociatedTakeAnswers(
    takeId: string,
  ): Promise<Take | null> {
    return this.prismaClient.$transaction(async (prismaClient) => {
      await prismaClient.takeAnswer.deleteMany({
        where: {
          takeId,
        },
      });
      return prismaClient.take.delete({
        where: {
          id: takeId,
        },
      });
    });
  }
}
