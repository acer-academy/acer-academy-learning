import { PrismaClient } from '@prisma/client';

export class QuizOnQuizQuestionDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async getQuizOnQuizQuestionByCompoundId(
    quizId: string,
    quizQuestionId: string,
  ) {
    return this.prismaClient.quizOnQuizQuestions.findUnique({
      where: {
        quizId_quizQuestionId: {
          quizId: quizId,
          quizQuestionId: quizQuestionId,
        },
      },
    });
  }

  public async getQuizOnQuizQuestionsByQuizId(quizId: string) {
    return this.prismaClient.quizOnQuizQuestions.findMany({
      where: {
        quizId: quizId,
      },
    });
  }
}
