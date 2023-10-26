import {
  LevelEnum,
  Prisma,
  PrismaClient,
  Quiz,
  QuizQuestion as QuizQuestionPrisma,
  QuizQuestionDifficultyEnum,
  QuizQuestionTopicEnum,
  SubjectEnum,
} from '@prisma/client';
import { QuizDao } from '../dao/QuizDao';
import { QuizQuestionDao } from '../dao/QuizQuestionDao';
import { QuizOnQuizQuestionDao } from '../dao/QuizOnQuizQuestionDao';
import { TakeDao } from '../dao/TakeDao';
import { TakeAnswerDao } from '../dao/TakeAnswerDao';
import { QuizAnswerService } from './QuizAnswerService';
import { Request } from 'express';
import { StudentDao } from '../dao/StudentDao';

export interface QuizFilterOptions {
  searchString?: string;
  subjects?: SubjectEnum[];
  levels?: LevelEnum[];
  difficulty?: QuizQuestionDifficultyEnum[];
  topics?: QuizQuestionTopicEnum[];
  offset: number;
  pageSize: number;
  showLatestOnly?: boolean;
  isPublic?: boolean;
  allocatedTo?: string[];
  strictPublicOrAllocated?: boolean;
}

type QuizQuestion = {
  quizQuestionId: string;
  quizQuestionIndex: number;
  quizQuestionMarks: number;
};

const EASY_QUESTION_COUNT = 10;
const MEDIUM_QUESTION_COUNT = 7;
const HARD_QUESTION_COUNT = 3;

export class QuizService {
  constructor(
    private quizDao: QuizDao = new QuizDao(),
    private quizQuestionDao: QuizQuestionDao = new QuizQuestionDao(),
    private quizOnQuizQuestionDao: QuizOnQuizQuestionDao = new QuizOnQuizQuestionDao(),
    private takeDao: TakeDao = new TakeDao(),
    private takeAnswerDao: TakeAnswerDao = new TakeAnswerDao(),
    private studentDao: StudentDao = new StudentDao(),
  ) {}

  private quizAnswerService = new QuizAnswerService();

  public async createQuiz(req: Request): Promise<Quiz> {
    const quizData = req.body;
    const quizQuestions = quizData.quizQuestions;
    const aggregatedDifficulty = await this.calculateAggregatedDifficulty(
      quizQuestions,
    );
    const formattedQuizData = {
      title: quizData.title,
      description: quizData.description,
      subject: quizData.subject,
      levels: quizData.levels,
      topics: quizData.topics,
      totalMarks: quizData.totalMarks,
      rewardPoints: quizData.rewardPoints,
      rewardMinimumMarks: quizData.rewardMinimumMarks,
      timeAllowed: quizData.timeAllowed,
      difficulty: aggregatedDifficulty,
      teacherCreated: {
        connect: { id: quizData.teacherCreated },
      },
      allocatedTo: {
        connect: quizData.allocatedTo?.map((studentId: string) => ({
          id: studentId,
        })),
      },
      isPublic: quizData.isPublic,
      quizQuestions: {
        createMany: {
          data: quizData.quizQuestions.map((question: QuizQuestion) => ({
            quizQuestionId: question.quizQuestionId,
            quizQuestionIndex: question.quizQuestionIndex,
            quizQuestionMarks: question.quizQuestionMarks,
          })),
        },
      },
    };
    return this.quizDao.createQuiz(formattedQuizData);
  }

  public async generateAdaptiveLearningQuiz(
    topics: string[],
    studentId: string,
  ): Promise<{
    thresholds: { [key in QuizQuestionDifficultyEnum]: number };
    questions: QuizQuestionPrisma[];
  }> {
    const student = await this.studentDao.getStudentById(studentId);
    if (!student) {
      throw Error('Student not found.');
    }
    const studentLevel = student.level;
    const quizQuestionTopics: QuizQuestionTopicEnum[] = topics.map(
      (topic) => topic as QuizQuestionTopicEnum,
    );

    // easy questions
    const easyQuestions =
      await this.quizQuestionDao.getAllQuizQuestionByConditions(
        quizQuestionTopics,
        'BASIC',
        studentLevel,
      );

    // medium questions
    const mediumQuestions =
      await this.quizQuestionDao.getAllQuizQuestionByConditions(
        quizQuestionTopics,
        'INTERMEDIATE',
        studentLevel,
      );

    // hard questions
    const hardQuestions =
      await this.quizQuestionDao.getAllQuizQuestionByConditions(
        quizQuestionTopics,
        'ADVANCED',
        studentLevel,
      );

    // randomly pick questions
    const quizQuestions: QuizQuestionPrisma[] = [];
    const easyQuestionCount = Math.min(
      EASY_QUESTION_COUNT,
      easyQuestions.length,
    );
    const mediumQuestionCount = Math.min(
      MEDIUM_QUESTION_COUNT,
      mediumQuestions.length,
    );
    const hardQuestionCount = Math.min(
      HARD_QUESTION_COUNT,
      hardQuestions.length,
    );

    for (let i = 0; i < easyQuestionCount; i++) {
      const randomIndex = Math.floor(Math.random() * easyQuestions.length);
      quizQuestions.push(easyQuestions[randomIndex]);
      easyQuestions.splice(randomIndex, 1);
    }

    for (let i = 0; i < mediumQuestionCount; i++) {
      const randomIndex = Math.floor(Math.random() * mediumQuestions.length);
      quizQuestions.push(mediumQuestions[randomIndex]);
      mediumQuestions.splice(randomIndex, 1);
    }

    for (let i = 0; i < hardQuestionCount; i++) {
      const randomIndex = Math.floor(Math.random() * hardQuestions.length);
      quizQuestions.push(hardQuestions[randomIndex]);
      hardQuestions.splice(randomIndex, 1);
    }

    // Split thresholds into 30% (easy) (40% medium) and (30%) hard
    const numberOfBasicQuestions = Math.min(
      easyQuestionCount,
      Math.ceil(10 * 0.3),
    );
    const numberOfIntermediateQuestions = Math.min(
      mediumQuestionCount,
      Math.ceil(10 * 0.4),
    );

    return {
      thresholds: {
        [QuizQuestionDifficultyEnum.BASIC]: numberOfBasicQuestions,
        [QuizQuestionDifficultyEnum.INTERMEDIATE]:
          numberOfBasicQuestions + numberOfIntermediateQuestions,
        [QuizQuestionDifficultyEnum.ADVANCED]: Math.min(
          10,
          numberOfBasicQuestions +
            numberOfIntermediateQuestions +
            hardQuestionCount,
        ),
      },
      questions: quizQuestions,
    };
  }

  public async getAllQuizzes(): Promise<Quiz[]> {
    return this.quizDao.getAllQuizzes();
  }

  public async getQuizById(quizId: string): Promise<Quiz | null> {
    return this.quizDao.getQuizById(quizId);
  }

  public async getQuizAllVersionsById(quizId: string): Promise<Quiz[] | null> {
    const prismaClient = new PrismaClient();
    try {
      const quiz = await prismaClient.quiz.findUnique({
        where: { id: quizId },
        include: {
          nextVersion: true,
          prevVersion: true,
        },
      });
      if (!quiz) {
        return null;
      }
      const allVersions = [quiz];
      let currentVersion = quiz;
      while (currentVersion.nextVersion) {
        currentVersion = await prismaClient.quiz.findUnique({
          where: { id: currentVersion.nextVersionId },
          include: {
            nextVersion: true,
            prevVersion: true,
          },
        });
        allVersions.push(currentVersion);
      }
      currentVersion = quiz;
      while (currentVersion.prevVersion) {
        currentVersion = await prismaClient.quiz.findUnique({
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
    } finally {
      await prismaClient.$disconnect();
    }
  }

  public async getQuizzesByStudentId(
    studentId: string,
  ): Promise<Quiz[] | null> {
    return this.quizDao.getQuizzesByStudentId(studentId);
  }

  public async getQuizzesByTeacherId(
    teacherId: string,
  ): Promise<Quiz[] | null> {
    return this.quizDao.getQuizzesByTeacherId(teacherId);
  }

  public async getFilteredQuizzes(
    filterOptions: QuizFilterOptions,
  ): Promise<{ quizzes: Quiz[]; totalCount: number }> {
    const where: Prisma.QuizWhereInput = {};
    const {
      subjects,
      levels,
      difficulty,
      topics,
      showLatestOnly,
      isPublic,
      allocatedTo,
      strictPublicOrAllocated,
      searchString,
    } = filterOptions;
    if (subjects && subjects.length > 0) {
      where.subject = { in: filterOptions.subjects };
    }
    if (!strictPublicOrAllocated && levels && levels.length > 0) {
      where.levels = { hasEvery: filterOptions.levels };
    }
    if (difficulty && difficulty.length > 0) {
      where.difficulty = { in: filterOptions.difficulty };
    }
    if (topics && topics.length > 0) {
      where.topics = { hasEvery: filterOptions.topics };
    }
    if (showLatestOnly == true) {
      where.nextVersionId = null;
    }
    if (isPublic !== undefined && isPublic !== null) {
      where.isPublic = isPublic;
    }
    if (!strictPublicOrAllocated && allocatedTo && allocatedTo.length > 0) {
      where.OR = [
        { isPublic: true },
        { allocatedTo: { some: { id: { in: filterOptions.allocatedTo } } } },
      ];
    }

    if (strictPublicOrAllocated && allocatedTo && allocatedTo?.length > 0) {
      where.allocatedTo = { some: { id: { in: filterOptions.allocatedTo } } };
    }

    if (strictPublicOrAllocated && (!allocatedTo || allocatedTo.length === 0)) {
      where.levels = { hasEvery: filterOptions.levels };
    }

    if (searchString) {
      where.OR = [
        { title: { contains: searchString, mode: 'insensitive' } },
        { description: { contains: searchString, mode: 'insensitive' } },
        {
          teacherCreated: {
            firstName: { contains: searchString, mode: 'insensitive' },
            lastName: { contains: searchString, mode: 'insensitive' },
          },
        },
      ];
    }

    const quizzes = await this.quizDao.getFilteredQuizzes(
      where,
      filterOptions.offset,
      filterOptions.pageSize,
    );
    const totalCount = await this.quizDao.getTotalCountOfFilteredQuizzes(where);
    return { quizzes, totalCount };
  }

  public async updateQuiz(quizId: string, req: Request): Promise<Quiz> {
    const oldQuiz = await this.getQuizById(quizId);
    for (const key of Object.keys(req.body)) {
      if (
        ![
          'allocatedTo',
          'isPublic',
          'quizQuestions',
          'levels',
          'topics',
          'teacherCreated',
        ].includes(key)
      ) {
        if (oldQuiz[key] !== req.body[key]) {
          break;
        }
        continue;
      }
      if (key == 'teacherCreated') {
        if (req.body.teacherCreated !== oldQuiz.teacherCreatedId) {
          break;
        }
        continue;
      }
      if (key == 'levels') {
        if (
          !(
            req.body.levels.every((lvl) => oldQuiz.levels.includes(lvl)) &&
            oldQuiz.levels.every((lvl) => req.body.levels.includes(lvl))
          )
        ) {
          break;
        }
        continue;
      }
      if (key == 'topics') {
        if (
          !(
            req.body.topics.every((topic) => oldQuiz.topics.includes(topic)) &&
            oldQuiz.topics.every((topic) => req.body.topics.includes(topic))
          )
        ) {
          break;
        }
        continue;
      }
      if (key == 'quizQuestions') {
        let matchingQuestions = true;
        const q = new QuizOnQuizQuestionDao();
        const q1 = await q.getQuizOnQuizQuestionsByQuizId(quizId);
        const formattedOldQuizQuestions = q1.map((question) => {
          return {
            quizQuestionId: question.quizQuestionId,
            quizQuestionIndex: question.quizQuestionIndex,
            quizQuestionMarks: question.quizQuestionMarks,
          };
        });
        for (const question of req.body.quizQuestions) {
          if (!formattedOldQuizQuestions.includes(question)) {
            matchingQuestions = false;
            break;
          }
        }
        if (!matchingQuestions) break;
      }
      const formattedQuizData = {
        allocatedTo: {
          connect: req.body.allocatedTo?.map((studentId: string) => ({
            id: studentId,
          })),
        },
        isPublic: req.body.isPublic,
      };
      return await this.quizDao.updateQuiz(quizId, formattedQuizData);
    }
    const quizData = req.body;
    const quizQuestions = quizData.quizQuestions;
    const aggregatedDifficulty = await this.calculateAggregatedDifficulty(
      quizQuestions,
    );
    const formattedQuizData = {
      title: quizData.title,
      description: quizData.description,
      subject: quizData.subject,
      levels: quizData.levels,
      topics: quizData.topics,
      totalMarks: quizData.totalMarks,
      rewardPoints: quizData.rewardPoints,
      rewardMinimumMarks: quizData.rewardMinimumMarks,
      timeAllowed: quizData.timeAllowed,
      difficulty: aggregatedDifficulty,
      teacherCreated: {
        connect: { id: quizData.teacherCreated },
      },
      allocatedTo: {
        connect: quizData.allocatedTo?.map((studentId: string) => ({
          id: studentId,
        })),
      },
      isPublic: quizData.isPublic,
      quizQuestions: {
        createMany: {
          data: quizData.quizQuestions.map((question: QuizQuestion) => ({
            quizQuestionId: question.quizQuestionId,
            quizQuestionIndex: question.quizQuestionIndex,
            quizQuestionMarks: question.quizQuestionMarks,
          })),
        },
      },
      version: oldQuiz.version + 1,
    };
    const newQuiz = await this.quizDao.createQuiz(formattedQuizData);
    await this.quizDao.updateQuiz(quizId, {
      nextVersion: { connect: { id: newQuiz.id } },
    });
    return newQuiz;
  }

  /** Updates a single question in published quiz (which has at least one Take
   * associated with it) to a newer version of the question, and triggers an
   * automated re-marking process of all affected TakeAnswers. */
  public async updatePublishedQuiz(
    quizId: string,
    req: Request,
  ): Promise<Quiz | null> {
    // 1. Update question in quizQuestions to the new version
    const oldQuizQuestions =
      await this.quizOnQuizQuestionDao.getQuizOnQuizQuestionsByQuizId(quizId);
    const quizData = req.body;
    const oldQuestionId: string = quizData.oldQuestionId;
    const newQuestionId: string = quizData.newQuestionId;
    const updatedQuizQuestions = oldQuizQuestions.map((quizQuestion) => {
      if (quizQuestion.quizQuestionId === oldQuestionId) {
        return {
          quizQuestionId: newQuestionId,
          quizQuestionIndex: quizQuestion.quizQuestionIndex,
          quizQuestionMarks: quizQuestion.quizQuestionMarks,
        };
      }
      return {
        quizQuestionId: quizQuestion.quizQuestionId,
        quizQuestionIndex: quizQuestion.quizQuestionIndex,
        quizQuestionMarks: quizQuestion.quizQuestionMarks,
      };
    });

    const oldQuiz = await this.getQuizById(quizId);
    const aggregatedDifficulty = await this.calculateAggregatedDifficulty(
      updatedQuizQuestions,
    );
    const formattedQuizData = {
      title: quizData.title,
      description: quizData.description,
      subject: quizData.subject,
      levels: quizData.levels,
      topics: quizData.topics,
      totalMarks: quizData.totalMarks,
      rewardPoints: quizData.rewardPoints,
      rewardMinimumMarks: quizData.rewardMinimumMarks,
      timeAllowed: quizData.timeAllowed,
      difficulty: aggregatedDifficulty,
      teacherCreated: {
        connect: { id: quizData.teacherCreated },
      },
      allocatedTo: {
        connect: quizData.allocatedTo?.map((studentId: string) => ({
          id: studentId,
        })),
      },
      isPublic: quizData.isPublic,
      quizQuestions: {
        createMany: {
          data: updatedQuizQuestions.map((question: QuizQuestion) => ({
            quizQuestionId: question.quizQuestionId,
            quizQuestionIndex: question.quizQuestionIndex,
            quizQuestionMarks: question.quizQuestionMarks,
          })),
        },
      },
      version: oldQuiz.version + 1,
    };

    // 2. Update version of the quiz
    const newQuiz = await this.quizDao.createQuiz(formattedQuizData);
    await this.quizDao.updateQuiz(quizId, {
      nextVersion: { connect: { id: newQuiz.id } },
    });

    // 3. All Takes referencing the previous version of the quiz are updated to reference the new version.
    const newQuestion = await this.quizQuestionDao.getQuizQuestionById(
      newQuestionId,
    );
    const takes = await this.takeDao.getTakesByQuiz(quizId);
    for (const take of takes) {
      await this.takeDao.updateTake(take.id, {
        quiz: { connect: { id: newQuiz.id } },
      });

      // 4. All TakeAnswers referencing the old version of the question are updated to reference the new version.
      const takeAnswers =
        await this.takeAnswerDao.getTakeAnswersByTakeAndQuizQuestion(
          take.id,
          oldQuestionId,
        );
      for (const takeAnswer of takeAnswers) {
        await this.takeAnswerDao.updateTakeAnswer(takeAnswer.id, {
          question: { connect: { id: newQuestionId } },
        });
      }

      // 5. Re-mark all affected TakeAnswers
      const oldIsCorrect = takeAnswers
        .map((takeAnswer) => takeAnswer.isCorrect)
        .reduce((x: boolean, y: boolean) => x !== false && y !== false, true);

      const correctAnswers = (
        await this.quizAnswerService.getAnswersByQuestion(newQuestionId)
      )
        .filter((x) => x.isCorrect)
        .map((x) => x.answer);
      for (const takeAnswer of takeAnswers) {
        const newIsCorrect = correctAnswers.includes(takeAnswer.studentAnswer);
        await this.takeAnswerDao.updateTakeAnswer(takeAnswer.id, {
          isCorrect: newIsCorrect,
        });
      }
      let updatedIsCorrect = takeAnswers
        .map((takeAnswer) => takeAnswer.isCorrect)
        .reduce((x: boolean, y: boolean) => x !== false && y !== false, true);
      if (newQuestion.questionType === 'MRQ') {
        updatedIsCorrect = takeAnswers.length == correctAnswers.length;
      }

      if (updatedIsCorrect !== oldIsCorrect) {
        // Need to change totalMarks
        const quizQuestionMarks = oldQuizQuestions.find(
          (q) => q.quizQuestionId === oldQuestionId,
        )?.quizQuestionMarks;
        let updatedTotalMarks = take.marks;
        if (updatedIsCorrect && !oldIsCorrect) {
          // Case 1: Student was wrong, now is correct -- add marks to totalMarks
          updatedTotalMarks += quizQuestionMarks;
        } else if (!updatedIsCorrect && oldIsCorrect) {
          // Case 2: Student was correct, now is wrong -- minus marks from totalMarks
          updatedTotalMarks -= quizQuestionMarks;
        }
        await this.takeDao.updateTake(take.id, {
          marks: updatedTotalMarks,
        });
      }
    }

    return newQuiz;
  }

  public async deleteQuiz(quizId: string): Promise<Quiz | null> {
    const prismaClient = new PrismaClient();
    const quizToDelete: Quiz | null = await this.quizDao.getQuizById(quizId);

    if (!quizToDelete) {
      throw Error('Error finding quiz to delete.');
    }

    const prevVersion = await prismaClient.quiz.findUnique({
      where: { nextVersionId: quizToDelete.id },
    });

    if (prevVersion) {
      if (quizToDelete.nextVersionId) {
        await this.quizDao.updateQuiz(prevVersion.id, {
          nextVersion: {
            connect: {
              id: quizToDelete.nextVersionId || null,
            },
          },
        });
      } else {
        await this.quizDao.updateQuiz(prevVersion.id, {
          nextVersion: {
            disconnect: true,
          },
        });
      }
    }

    await prismaClient.quizOnQuizQuestions.deleteMany({
      where: { quizId: quizId },
    });

    for (const take of await prismaClient.take.findMany({
      where: { quizId: quizId },
      include: { studentAnswers: true },
    })) {
      await prismaClient.takeAnswer.deleteMany({ where: { takeId: take.id } });
      await prismaClient.take.delete({ where: { id: take.id } });
    }

    return this.quizDao.deleteQuiz(quizId);
  }

  // Helper class
  private async calculateAggregatedDifficulty(
    quizQuestions: QuizQuestion[],
  ): Promise<QuizQuestionDifficultyEnum> {
    const quizQuestionsDifficultyArr: QuizQuestionDifficultyEnum[] = [];
    for (const question of quizQuestions) {
      const questionDifficulty = (
        await this.quizQuestionDao.getQuizQuestionById(question.quizQuestionId)
      ).difficulty;
      quizQuestionsDifficultyArr.push(questionDifficulty);
    }
    const averageDifficulty =
      quizQuestionsDifficultyArr
        .map((difficulty) => {
          switch (difficulty) {
            case 'BASIC':
              return 1;
            case 'INTERMEDIATE':
              return 2;
            case 'ADVANCED':
              return 3;
            default:
              throw Error('Unknown difficulty found.');
          }
        })
        .reduce((a, b) => a + b, 0) / quizQuestions.length;
    let aggregatedDifficulty: QuizQuestionDifficultyEnum;
    if (averageDifficulty <= 1) {
      aggregatedDifficulty = 'BASIC';
    } else if (averageDifficulty <= 2) {
      aggregatedDifficulty = 'INTERMEDIATE';
    } else {
      aggregatedDifficulty = 'ADVANCED';
    }
    return aggregatedDifficulty;
  }
}
