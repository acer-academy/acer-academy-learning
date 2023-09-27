import {
  LevelEnum,
  Prisma,
  PrismaClient,
  QuizAnswer,
  QuizQuestion,
  QuizQuestionDifficultyEnum,
  QuizQuestionTopicEnum,
} from '@prisma/client';
import { QuizQuestionDao } from '../dao/QuizQuestionDao';
import { Request } from 'express';
import { QuizAnswerService } from './QuizAnswerService';

export interface QuizQuestionFilterOptions {
  topics?: QuizQuestionTopicEnum[];
  levels?: LevelEnum[];
  difficulty?: QuizQuestionDifficultyEnum;
  isMcq?: boolean;
  isMrq?: boolean;
  isTfq?: boolean;
  isOpenEnded?: boolean;
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
  ): Promise<QuizQuestion[]> {
    const where: Prisma.QuizQuestionWhereInput = {};

    if (filterOptions.topics) {
      where.topics = {
        hasSome: filterOptions.topics,
      };
    }

    if (filterOptions.levels) {
      where.levels = {
        hasSome: filterOptions.levels,
      };
    }

    if (filterOptions.difficulty) {
      where.difficulty = filterOptions.difficulty;
    }

    if (filterOptions.isMcq !== undefined) {
      where.isMcq = filterOptions.isMcq;
    }

    if (filterOptions.isMrq !== undefined) {
      where.isMrq = filterOptions.isMrq;
    }

    if (filterOptions.isTfq !== undefined) {
      where.isTfq = filterOptions.isTfq;
    }

    if (filterOptions.isOpenEnded !== undefined) {
      where.isMcq = false;
      where.isMrq = false;
      where.isTfq = false;
    }

    return this.quizQuestionDao.getFilteredQuizQuestions(where);
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
