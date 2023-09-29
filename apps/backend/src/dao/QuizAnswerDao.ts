import { Prisma, PrismaClient, QuizAnswer, QuizQuestion } from '@prisma/client';

export class QuizAnswerDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createQuizAnswer(
    answerData: Prisma.QuizAnswerCreateInput,
  ): Promise<QuizAnswer> {
    return this.prismaClient.quizAnswer.create({
      data: answerData,
    });
  }

  public async getAllQuizAnswers(): Promise<QuizAnswer[]> {
    return this.prismaClient.quizAnswer.findMany();
  }

  public async getQuizAnswerById(answerId: string): Promise<QuizAnswer | null> {
    return this.prismaClient.quizAnswer.findUnique({
      where: { id: answerId },
    });
  }

  public async getAnswersByQuestionId(
    questionId: string,
  ): Promise<QuizAnswer[]> {
    return this.prismaClient.quizAnswer.findMany({
      where: {
        questionId,
      },
    });
  }

  public async updateQuizAnswer(
    answerId: string,
    answerData: Prisma.QuizAnswerUpdateInput,
  ): Promise<QuizAnswer | null> {
    return this.prismaClient.quizAnswer.update({
      where: { id: answerId },
      data: answerData,
    });
  }

  public async deleteQuizAnswer(answerId: string): Promise<QuizAnswer | null> {
    return this.prismaClient.quizAnswer.delete({
      where: { id: answerId },
    });
  }
}
