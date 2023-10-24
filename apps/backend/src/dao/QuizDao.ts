import { Prisma, PrismaClient, Quiz } from '@prisma/client';

export class QuizDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createQuiz(quizData: Prisma.QuizCreateInput): Promise<Quiz> {
    return this.prismaClient.quiz.create({
      data: quizData,
      include: {
        allocatedTo: {
          select: {
            id: true,
          },
        },
        takes: true,
        quizQuestions: {
          include: {
            quizQuestion: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });
  }

  public async getAllQuizzes(): Promise<Quiz[]> {
    return this.prismaClient.quiz.findMany({
      include: {
        allocatedTo: {
          select: {
            id: true,
          },
        },
        takes: true,
        quizQuestions: {
          include: {
            quizQuestion: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });
  }

  public async getQuizById(quizId: string): Promise<Quiz | null> {
    return this.prismaClient.quiz.findUnique({
      where: { id: quizId },
      include: {
        allocatedTo: {
          select: {
            id: true,
          },
        },
        teacherCreated: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        takes: true,
        quizQuestions: {
          orderBy: { quizQuestionIndex: 'asc' },
          include: {
            quizQuestion: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });
  }

  public async getQuizzesByStudentId(
    studentId: string,
  ): Promise<Quiz[] | null> {
    return this.prismaClient.quiz.findMany({
      where: {
        allocatedTo: {
          some: { id: studentId },
        },
      },
      include: {
        allocatedTo: {
          select: {
            id: true,
          },
        },
        takes: true,
        quizQuestions: {
          include: {
            quizQuestion: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });
  }

  public async getQuizzesByTeacherId(
    teacherId: string,
  ): Promise<Quiz[] | null> {
    return this.prismaClient.quiz.findMany({
      where: {
        teacherCreatedId: teacherId,
      },
      include: {
        allocatedTo: {
          select: {
            id: true,
          },
        },
        takes: true,
        quizQuestions: {
          include: {
            quizQuestion: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });
  }

  public async getFilteredQuizzes(
    filterOptions: Prisma.QuizWhereInput,
    offset: number,
    pageSize: number,
  ): Promise<Quiz[]> {
    return this.prismaClient.quiz.findMany({
      where: filterOptions,
      skip: offset,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        allocatedTo: {
          select: {
            id: true,
          },
        },
        takes: true,
        teacherCreated: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        quizQuestions: {
          include: {
            quizQuestion: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });
  }

  public async getTotalCountOfFilteredQuizzes(
    filterOptions: Prisma.QuizWhereInput,
  ): Promise<number> {
    return this.prismaClient.quiz.count({
      where: filterOptions,
    });
  }

  public async updateQuiz(
    quizId: string,
    quizData: Prisma.QuizUpdateInput,
  ): Promise<Quiz | null> {
    return this.prismaClient.quiz.update({
      where: { id: quizId },
      data: quizData,
      include: {
        allocatedTo: {
          select: {
            id: true,
          },
        },
        takes: true,
        quizQuestions: {
          include: {
            quizQuestion: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });
  }

  public async deleteQuiz(quizId: string): Promise<Quiz | null> {
    return this.prismaClient.quiz.delete({
      where: { id: quizId },
      include: {
        allocatedTo: {
          select: {
            id: true,
          },
        },
        takes: true,
        quizQuestions: {
          include: {
            quizQuestion: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
    });
  }
}
