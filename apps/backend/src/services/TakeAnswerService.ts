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

  public async getTakeAnswersByQuestionId(
    questionId: string,
  ): Promise<TakeAnswer[]> {
    return this.takeAnswerDao.getTakeAnswersByQuestionId(questionId);
  }

  public async getTakeAnswersByTakeId(takeId: string): Promise<TakeAnswer[]> {
    return this.takeAnswerDao.getTakeAnswersByTakeId(takeId);
  }

  public async getCorrectTakeAnswersByQuestionId(
    questionId: string,
  ): Promise<TakeAnswer[]> {
    return this.takeAnswerDao.getCorrectTakeAnswersByQuestionId(questionId);
  }

  public async updateTakeAnswer(
    answerId: string,
    answerData: Prisma.TakeAnswerUpdateInput,
  ): Promise<TakeAnswer | null> {
    return this.takeAnswerDao.updateTakeAnswer(answerId, answerData);
  }

  public async deleteTakeAnswer(answerId: string): Promise<TakeAnswer | null> {
    return this.takeAnswerDao.deleteTakeAnswer(answerId);
  }
}
