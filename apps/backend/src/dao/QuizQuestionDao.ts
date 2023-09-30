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

  public async getFilteredQuizQuestions(
    filterOptions: Prisma.QuizQuestionWhereInput,
  ): Promise<QuizQuestion[]> {
    return this.prismaClient.quizQuestion.findMany({
      where: filterOptions,
      include: {
        answers: true,
      },
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
