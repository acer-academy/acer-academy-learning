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

export interface QuizQuestionFilterOptions {
  topics?: QuizQuestionTopicEnum[];
  levels?: LevelEnum[];
  difficulty?: QuizQuestionDifficultyEnum[];
  questionType?: QuizQuestionTypeEnum[];
  status?: QuizQuestionStatusEnum[];
  offset: number;
  pageSize: number;
  showLatestOnly?: boolean;
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

  public async getQuizQuestionAllVersionsById(
    questionId: string,
  ): Promise<QuizQuestion[] | null> {
    const prismaClient = new PrismaClient();
    try {
      const question = await prismaClient.quizQuestion.findUnique({
        where: { id: questionId },
        include: {
          nextVersion: true,
          prevVersion: true,
        },
      });
      if (!question) {
        return null;
      }
      const allVersions = [question];
      let currentVersion = question;
      while (currentVersion.nextVersion) {
        currentVersion = await prismaClient.quizQuestion.findUnique({
          where: { id: currentVersion.nextVersionId },
          include: {
            nextVersion: true,
            prevVersion: true,
          },
        });
        allVersions.push(currentVersion);
      }
      currentVersion = question;
      while (currentVersion.prevVersion) {
        currentVersion = await prismaClient.quizQuestion.findUnique({
          where: { id: currentVersion.prevVersion.id },
          include: {
            nextVersion: true,
            prevVersion: true,
          },
        });
        allVersions.unshift(currentVersion);
      }
      const versionsWithoutRelations = allVersions.map((version) => {
        const { nextVersion, prevVersion, ...versionWithoutRelations } =
          version;
        return versionWithoutRelations;
      });
      versionsWithoutRelations.sort((a, b) => a.version - b.version);
      return versionsWithoutRelations;
    } catch (error) {
      throw error;
    } finally {
      await prismaClient.$disconnect();
    }
  }

  public async getFilteredQuizQuestions(
    filterOptions: QuizQuestionFilterOptions,
  ): Promise<{ questions: QuizQuestion[]; totalCount: number }> {
    const where: Prisma.QuizQuestionWhereInput = {};
    const { topics, levels, difficulty, questionType, status, showLatestOnly } =
      filterOptions;

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

    if (showLatestOnly == true) {
      where.nextVersionId = null;
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
    const oldQuestion: QuizQuestion = await this.getQuizQuestionById(
      questionId,
    );
    for (const key in oldQuestion) {
      if (
        !Object.keys(req.body).includes(key) &&
        !['id', 'nextVersionId', 'createdAt', 'version'].includes(key)
      ) {
        req.body[key] = oldQuestion[key];
      }
    }
    if (req.body.answers) {
      if (Array.isArray(req.body.answers)) {
        req.body.answers = req.body.answers.map((answer: QuizAnswer) => {
          const { id, questionId, createdAt, ...rest } = answer;
          return rest;
        });
      }
      req.body.answers = { createMany: { data: req.body.answers } };
    }
    req.body['version'] = oldQuestion.version + 1;
    const updatedQuestion: QuizQuestion = await this.createQuizQuestion(
      req.body,
    );
    oldQuestion.nextVersionId = updatedQuestion.id;
    await this.quizQuestionDao.updateQuizQuestion(questionId, {
      nextVersion: { connect: { id: updatedQuestion.id } },
    });
    return updatedQuestion;
  }

  public async deleteQuizQuestion(
    questionId: string,
  ): Promise<QuizQuestion | null> {
    const prismaClient = new PrismaClient();
    const oldQuestion: QuizQuestion = await this.getQuizQuestionById(
      questionId,
    );
    // find questions that point to this question
    const oldQuestionPrev = await prismaClient.quizQuestion.findUnique({
      where: { nextVersionId: questionId },
    });
    // get next version
    const oldQuestionNext =
      oldQuestion.nextVersionId == null
        ? null
        : await prismaClient.quizQuestion.findUnique({
            where: { id: oldQuestion.nextVersionId },
          });
    // if there is a previous version and a next version
    if (oldQuestionPrev && oldQuestionNext) {
      await this.quizQuestionDao.updateQuizQuestion(oldQuestionPrev.id, {
        nextVersion: { connect: { id: oldQuestionNext.id } },
      });
    } else if (oldQuestionPrev && !oldQuestionNext) {
      await this.quizQuestionDao.updateQuizQuestion(oldQuestionPrev.id, {
        nextVersion: { disconnect: true },
      });
    }
    //cascade delete to associated answers
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
