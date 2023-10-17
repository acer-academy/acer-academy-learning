import { Prisma, PrismaClient, Take } from '@prisma/client';
import { TakeDao } from '../dao/TakeDao';
import { Request } from 'express';
import { QuizQuestionService } from './QuizQuestionService';
import { QuizAnswerService } from './QuizAnswerService';

export class TakeService {
  constructor(private takeDao: TakeDao = new TakeDao()) {}
  private quizAnswerService = new QuizAnswerService();

  public async createTake(req: Request): Promise<Take> {
    const prismaClient = new PrismaClient();
    const takeData = req.body;
    const { timeTaken, takenById, quizId, studentAnswers } = takeData;
    let totalMarks = 0;
    for (const answer of studentAnswers) {
      answer.isCorrect = false;
      const correctAnswer = (
        await this.quizAnswerService.getAnswersByQuestion(answer.questionId)
      ).filter((x) => x.isCorrect)[0];
      if (answer.studentAnswer == correctAnswer.answer) {
        answer.isCorrect = true;
        const joinTableRelation =
          await prismaClient.quizOnQuizQuestions.findUnique({
            where: {
              quizId_quizQuestionId: {
                quizId: quizId,
                quizQuestionId: answer.questionId,
              },
            },
          });
        if (!joinTableRelation) {
          throw Error(
            `Error occured while retrieving marks for question ID: ${answer.questionId}`,
          );
        }
        totalMarks += joinTableRelation.quizQuestionMarks;
      }
    }
    const formattedTakeData = {
      marks: totalMarks,
      timeTaken: timeTaken,
      takenBy: {
        connect: { id: takenById },
      },
      quiz: {
        connect: { id: quizId },
      },
      studentAnswers: {
        createMany: {
          data: studentAnswers,
        },
      },
    };
    return this.takeDao.createTake(formattedTakeData);
  }

  public async getAllTakes(): Promise<Take[]> {
    return this.takeDao.getAllTakes();
  }

  public async getTakeById(takeId: string): Promise<Take | null> {
    return this.takeDao.getTakeById(takeId);
  }

  public async getTakesByStudent(studentId: string): Promise<Take[]> {
    return this.takeDao.getTakesByStudent(studentId);
  }

  public async getTakesByQuiz(quizId: string): Promise<Take[]> {
    return this.takeDao.getTakesByQuiz(quizId);
  }

  public async updateTake(
    takeId: string,
    takeData: Prisma.TakeUpdateInput,
  ): Promise<Take | null> {
    return this.takeDao.updateTake(takeId, takeData);
  }

  public async deleteTake(takeId: string): Promise<Take | null> {
    const prismaClient = new PrismaClient();
    return prismaClient.$transaction(async (prismaClient) => {
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
