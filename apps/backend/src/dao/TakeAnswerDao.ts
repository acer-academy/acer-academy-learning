import { Prisma, PrismaClient, TakeAnswer } from '@prisma/client';

export class TakeAnswerDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createTakeAnswer(
    answerData: Prisma.TakeAnswerCreateInput,
  ): Promise<TakeAnswer> {
    return this.prismaClient.takeAnswer.create({
      data: answerData,
    });
  }

  public async getAllTakeAnswers(): Promise<TakeAnswer[]> {
    return this.prismaClient.takeAnswer.findMany();
  }

  public async getTakeAnswerById(answerId: string): Promise<TakeAnswer | null> {
    return this.prismaClient.takeAnswer.findUnique({
      where: { id: answerId },
    });
  }

  public async updateTakeAnswer(
    answerId: string,
    answerData: Prisma.TakeAnswerUpdateInput,
  ): Promise<TakeAnswer | null> {
    return this.prismaClient.takeAnswer.update({
      where: { id: answerId },
      data: answerData,
    });
  }

  public async deleteTakeAnswer(answerId: string): Promise<TakeAnswer | null> {
    return this.prismaClient.takeAnswer.delete({
      where: { id: answerId },
    });
  }
}
