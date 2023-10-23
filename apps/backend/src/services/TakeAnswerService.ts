import { Prisma, TakeAnswer } from '@prisma/client';
import { TakeAnswerDao } from '../dao/TakeAnswerDao';

export class TakeAnswerService {
  constructor(private takeAnswerDao: TakeAnswerDao = new TakeAnswerDao()) {}

  public async createTakeAnswer(
    answerData: Prisma.TakeAnswerCreateInput,
  ): Promise<TakeAnswer> {
    return this.takeAnswerDao.createTakeAnswer(answerData);
  }

  public async getAllTakeAnswers(): Promise<TakeAnswer[]> {
    return this.takeAnswerDao.getAllTakeAnswers();
  }

  public async getTakeAnswerById(answerId: string): Promise<TakeAnswer | null> {
    return this.takeAnswerDao.getTakeAnswerById(answerId);
  }
  public async getTakeAnswersByStudent(
    studentId: string,
  ): Promise<TakeAnswer[]> {
    return this.takeAnswerDao.getTakeAnswersByStudent(studentId);
  }

  public async getTakeAnswersByTake(takeId: string): Promise<TakeAnswer[]> {
    return this.takeAnswerDao.getTakeAnswersByTake(takeId);
  }

  public async getTakeAnswersByQuizQuestion(
    quizQuestionId: string,
  ): Promise<TakeAnswer[]> {
    return this.takeAnswerDao.getTakeAnswersByQuizQuestion(quizQuestionId);
  }

  public async getCorrectTakeAnswersByQuestionId(
    questionId: string,
  ): Promise<TakeAnswer[]> {
    return this.takeAnswerDao.getCorrectTakeAnswersByQuestionId(questionId);
  }

  public async updateTakeAnswer(
    answerId: string,
    answerData: Prisma.TakeAnswerUncheckedUpdateInput,
  ): Promise<TakeAnswer | null> {
    return this.takeAnswerDao.updateTakeAnswer(answerId, answerData);
  }

  public async deleteTakeAnswer(answerId: string): Promise<TakeAnswer | null> {
    return this.takeAnswerDao.deleteTakeAnswer(answerId);
  }
}
