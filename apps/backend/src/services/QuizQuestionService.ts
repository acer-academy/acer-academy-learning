import {
  LevelEnum,
  Prisma,
  PrismaClient,
  QuizAnswer,
  QuizQuestion,
  QuizQuestionDifficultyEnum,
  QuizQuestionStatusEnum,
  QuizQuestionTopicEnum,
  QuizQuestionTypeEnum,
} from '@prisma/client';
import { QuizQuestionDao } from '../dao/QuizQuestionDao';
import { Request } from 'express';
import { QuizAnswerService } from './QuizAnswerService';

export interface QuizQuestionFilterOptions {
  topics?: QuizQuestionTopicEnum[];
  levels?: LevelEnum[];
  difficulty?: QuizQuestionDifficultyEnum[];
  questionType?: QuizQuestionTypeEnum[];
  status?: QuizQuestionStatusEnum[];
  offset: number;
  pageSize: number;
}

export class QuizQuestionService {
  constructor(
    private quizQuestionDao: QuizQuestionDao = new QuizQuestionDao(),
  ) {}

  public async createQuizQuestion(
    questionData: Prisma.QuizQuestionCreateInput,
  ): Promise<QuizQuestion> {
    return this.quizQuestionDao.createQuizQuestion(questionData);
  }

  public async getAllQuizQuestions(): Promise<QuizQuestion[]> {
    return this.quizQuestionDao.getAllQuizQuestions();
  }

  public async getQuizQuestionById(
    questionId: string,
  ): Promise<QuizQuestion | null> {
    return this.quizQuestionDao.getQuizQuestionById(questionId);
  }

  public async getFilteredQuizQuestions(
    filterOptions: QuizQuestionFilterOptions,
  ): Promise<{ questions: QuizQuestion[]; totalCount: number }> {
    const where: Prisma.QuizQuestionWhereInput = {};
    const { topics, levels, difficulty, questionType, status } = filterOptions;

    if (topics && topics.length > 0) {
      where.topics = {
        hasEvery: filterOptions.topics,
      };
    }

    if (levels && levels.length > 0) {
      where.levels = {
        hasEvery: filterOptions.levels,
      };
    }

    if (difficulty && difficulty.length > 0) {
      where.difficulty = {
        in: filterOptions.difficulty,
      };
    }

    if (questionType && questionType.length > 0) {
      where.questionType = {
        in: filterOptions.questionType,
      };
    }

    if (status && status.length > 0) {
      where.status = {
        in: filterOptions.status,
      };
    }

    const questions = await this.quizQuestionDao.getFilteredQuizQuestions(
      where,
      filterOptions.offset,
      filterOptions.pageSize,
    );

    const totalCount =
      await this.quizQuestionDao.getTotalCountOfFilteredQuestions(where);

    return { totalCount, questions };
  }

  public async updateQuizQuestion(
    questionId: string,
    req: Request,
  ): Promise<QuizQuestion | null> {
    const quizAnswerService = new QuizAnswerService();
    if (req.body.answers) {
      if (Array.isArray(req.body.answers)) {
        req.body.answers = req.body.answers.map((answer: QuizAnswer) => {
          const { id, questionId, ...rest } = answer;
          return rest;
        });
      }
      req.body.answers = { createMany: { data: req.body.answers } };
      const oldAnswers: QuizAnswer[] =
        await quizAnswerService.getAnswersByQuestion(questionId);
      for (const oldAnswer of oldAnswers) {
        await quizAnswerService.deleteQuizAnswer(oldAnswer.id);
      }
      return this.quizQuestionDao.updateQuizQuestion(questionId, req.body);
    } else {
      return this.quizQuestionDao.updateQuizQuestion(questionId, req.body);
    }
  }

  public async deleteQuizQuestion(
    questionId: string,
  ): Promise<QuizQuestion | null> {
    // cascade delete to associated answers
    const prismaClient = new PrismaClient();
    return prismaClient.$transaction(async (prisma) => {
      await prisma.quizAnswer.deleteMany({
        where: {
          questionId,
        },
      });
      return prisma.quizQuestion.delete({
        where: {
          id: questionId,
        },
      });
    });
  }
}
