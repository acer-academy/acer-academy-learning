import { Prisma, PrismaClient, QuizQuestion } from '@prisma/client';

export class QuizQuestionDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createQuizQuestion(
    questionData: Prisma.QuizQuestionCreateInput,
  ): Promise<QuizQuestion> {
    return this.prismaClient.quizQuestion.create({
      data: questionData,
      include: {
        answers: true,
      },
    });
  }

  public async getAllQuizQuestions(): Promise<QuizQuestion[]> {
    return this.prismaClient.quizQuestion.findMany({
      include: {
        answers: true,
      },
    });
  }

  public async getQuizQuestionById(
    questionId: string,
  ): Promise<QuizQuestion | null> {
    return this.prismaClient.quizQuestion.findUnique({
      where: { id: questionId },
      include: {
        answers: true,
      },
    });
  }

  public async getTotalCountOfFilteredQuestions(
    filterOptions: Prisma.QuizQuestionWhereInput,
  ): Promise<number> {
    return this.prismaClient.quizQuestion.count({
      where: filterOptions,
    });
  }

  public async getFilteredQuizQuestions(
    filterOptions: Prisma.QuizQuestionWhereInput,
    offset: number,
    pageSize: number,
  ): Promise<QuizQuestion[]> {
    return this.prismaClient.quizQuestion.findMany({
      where: filterOptions,
      include: {
        answers: true,
      },
      skip: offset,
      take: pageSize,
    });
  }

  public async updateQuizQuestion(
    questionId: string,
    questionData: Prisma.QuizQuestionUpdateInput,
  ): Promise<QuizQuestion | null> {
    return this.prismaClient.quizQuestion.update({
      where: { id: questionId },
      data: questionData,
      include: {
        answers: true,
      },
    });
  }

  public async deleteQuizQuestion(
    questionId: string,
  ): Promise<QuizQuestion | null> {
    return this.prismaClient.quizQuestion.delete({
      where: { id: questionId },
      include: {
        answers: true,
      },
    });
  }
}
