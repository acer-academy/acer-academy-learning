import { Prisma, QuizAnswer, QuizQuestion } from '@prisma/client';
import { QuizAnswerDao } from '../dao/QuizAnswerDao';

export class QuizAnswerService {
  constructor(private quizAnswerDao: QuizAnswerDao = new QuizAnswerDao()) {}

  public async createQuizAnswer(
    answerData: Prisma.QuizAnswerCreateInput,
  ): Promise<QuizAnswer> {
    return this.quizAnswerDao.createQuizAnswer(answerData);
  }

  public async getAllQuizAnswers(): Promise<QuizAnswer[]> {
    return this.quizAnswerDao.getAllQuizAnswers();
  }

  public async getQuizAnswerById(answerId: string): Promise<QuizAnswer | null> {
    return this.quizAnswerDao.getQuizAnswerById(answerId);
  }

  public async getAnswersByQuestion(questionId: string): Promise<QuizAnswer[]> {
    return this.quizAnswerDao.getAnswersByQuestionId(questionId);
  }

  public async getCorrectAnswersByQuestion(
    questionId: string,
  ): Promise<QuizAnswer[]> {
    return this.quizAnswerDao.getCorrectAnswersByQuestionId(questionId);
  }

  public async updateQuizAnswer(
    answerId: string,
    answerData: Prisma.QuizAnswerUpdateInput,
  ): Promise<QuizAnswer | null> {
    return this.quizAnswerDao.updateQuizAnswer(answerId, answerData);
  }

  public async deleteQuizAnswer(answerId: string): Promise<QuizAnswer | null> {
    return this.quizAnswerDao.deleteQuizAnswer(answerId);
  }
}
