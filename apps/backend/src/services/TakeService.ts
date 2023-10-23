import {
  Prisma,
  Take,
  TakeAnswer,
  LevelEnum,
  QuizQuestionDifficultyEnum,
  QuizQuestionTopicEnum,
  SubjectEnum,
} from '@prisma/client';
import { TakeDao } from '../dao/TakeDao';
import { Request } from 'express';
import { QuizQuestionService } from './QuizQuestionService';
import { QuizAnswerService } from './QuizAnswerService';
import { QuizOnQuizQuestionDao } from '../dao/QuizOnQuizQuestionDao';
import { QuizFilterOptions } from './QuizService';

export interface TakeFilterOptions {
  studentId: string;
  subjects?: SubjectEnum[];
  levels?: LevelEnum[];
  difficulty?: QuizQuestionDifficultyEnum[];
  topics?: QuizQuestionTopicEnum[];
  offset: number;
  pageSize: number;
  showLatestOnly?: boolean;
}
export class TakeService {
  constructor(
    private takeDao: TakeDao = new TakeDao(),
    private quizOnQuizQuestionDao: QuizOnQuizQuestionDao = new QuizOnQuizQuestionDao(),
  ) {}
  private quizAnswerService = new QuizAnswerService();
  private quizQuestionService = new QuizQuestionService();

  public async createTake(req: Request): Promise<Take> {
    const takeData = req.body;
    const {
      timeTaken,
      takenById,
      quizId,
      studentAnswers,
    }: {
      timeTaken: number;
      takenById: string;
      quizId: string;
      studentAnswers: TakeAnswer[];
    } = takeData;
    let totalMarks = 0;
    const studentAnswersMap: Map<string, TakeAnswer[]> = new Map();
    const formattedStudentAnswers: TakeAnswer[] = [];
    for (const answer of studentAnswers) {
      if (!Object.keys(studentAnswersMap).includes(answer.questionId)) {
        studentAnswersMap[answer.questionId] = [answer];
      } else studentAnswersMap[answer.questionId].push(answer);
    }
    for (const quizQuestionId in studentAnswersMap) {
      const correctAnswers = (
        await this.quizAnswerService.getAnswersByQuestion(quizQuestionId)
      )
        .filter((x) => x.isCorrect)
        .map((x) => x.answer);
      const { quizQuestionMarks } =
        await this.quizOnQuizQuestionDao.getQuizOnQuizQuestionByCompoundId(
          quizId,
          quizQuestionId,
        );
      for (const answer of studentAnswersMap[quizQuestionId]) {
        answer.isCorrect = correctAnswers.includes(answer.studentAnswer)
          ? true
          : false;
        formattedStudentAnswers.push(answer);
      }
      const currQuestionType = (
        await this.quizQuestionService.getQuizQuestionById(quizQuestionId)
      ).questionType;
      totalMarks +=
        (currQuestionType == 'MRQ' &&
          studentAnswersMap[quizQuestionId].reduce(
            (x: TakeAnswer, y: TakeAnswer) =>
              x.isCorrect !== false && y.isCorrect !== false,
            true,
          ) &&
          studentAnswersMap[quizQuestionId].length == correctAnswers.length) ||
        (currQuestionType !== 'MRQ' &&
          studentAnswersMap[quizQuestionId].reduce(
            (x: TakeAnswer, y: TakeAnswer) =>
              x.isCorrect !== false && y.isCorrect !== false,
            true,
          ))
          ? quizQuestionMarks
          : 0;
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
          data: formattedStudentAnswers,
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

  public async getFilteredTakes(
    filterOptions: TakeFilterOptions,
  ): Promise<{ takes: Take[]; totalCount: number }> {
    const where: Prisma.TakeWhereInput = {};
    const quizWhere: Prisma.QuizWhereInput = {};
    const { studentId, subjects, levels, difficulty, topics, showLatestOnly } =
      filterOptions;
    if (subjects && subjects.length > 0) {
      quizWhere.subject = { in: filterOptions.subjects };
    }
    if (levels && levels.length > 0) {
      quizWhere.levels = { hasEvery: filterOptions.levels };
    }
    if (difficulty && difficulty.length > 0) {
      quizWhere.difficulty = { in: filterOptions.difficulty };
    }
    if (topics && topics.length > 0) {
      quizWhere.topics = { hasEvery: filterOptions.topics };
    }
    if (showLatestOnly == true) {
      quizWhere.nextVersionId = null;
    }
    where.quiz = quizWhere;

    if (studentId) {
      where.takenById = studentId;
    }

    const takes = await this.takeDao.getFilteredTakes(
      where,
      filterOptions.offset,
      filterOptions.pageSize,
    );
    const totalCount = await this.takeDao.getTotalCountOfFilteredTakes(where);
    return { takes, totalCount };
  }

  public async updateTake(
    takeId: string,
    takeData: Prisma.TakeUpdateInput,
  ): Promise<Take | null> {
    return this.takeDao.updateTake(takeId, takeData);
  }

  public async deleteTake(takeId: string): Promise<Take | null> {
    return this.takeDao.deleteTakeAndAssociatedTakeAnswers(takeId);
  }
}
