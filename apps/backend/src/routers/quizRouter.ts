import { NextFunction, Request, Response, Router } from 'express';
import { QuizFilterOptions, QuizService } from '../services/QuizService';
import { Prisma } from '@prisma/client';
import {
  validateBodyDifficultiesExist,
  validateBodyLevelsExist,
  validateBodyNewQuestionIdExists,
  validateBodyNewQuestionIdIsLaterVersionOfOldQuestionId,
  validateBodyOldQuestionIdExists,
  validateBodyQuizFormatValid,
  validateBodyQuizOnQuizQuestionFormatValid,
  validateBodyQuizQuestionTopicsExist,
  validateBodyQuizTeacherCreatedExists,
  validateBodySubjectExists,
  validateBodySubjectsExist,
  validateBodyUpdatePublishedQuizFormatValid,
  validateParamsQuizHasNoTakes,
  validateParamsQuizIsLatest,
} from '../middleware/validationMiddleware';

const quizRouter = Router();
const quizService = new QuizService();

/**
 * POST /quiz/
 * Creates a new quiz.
 */
quizRouter.post(
  '/',
  validateBodyQuizFormatValid,
  validateBodySubjectExists,
  validateBodyLevelsExist,
  validateBodyQuizQuestionTopicsExist,
  validateBodyQuizTeacherCreatedExists,
  validateBodyQuizOnQuizQuestionFormatValid,
  async (req: Request, res: Response) => {
    try {
      const newQuiz = await quizService.createQuiz(req);
      return res.status(201).json(newQuiz);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
);

/**
 * GET /quiz/
 * Retrieves all quizzes.
 */
quizRouter.get('/', async (req: Request, res: Response) => {
  try {
    const quizzes = await quizService.getAllQuizzes();
    return res.status(200).json(quizzes);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /quiz/generate-adaptive-learning-quiz
 * Retrieves a list of questions based on selected topic and student's level.
 * Returns 10 easy, 7 medium and 3 hard questions.
 */
quizRouter.get(
  '/generate-adaptive-learning-quiz/:studentId',
  async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const retrievedTopics = req.query.topics;
    const topics: string[] = Array.isArray(retrievedTopics)
      ? (retrievedTopics as string[])
      : [retrievedTopics as string];

    try {
      const questions = await quizService.generateAdaptiveLearningQuiz(
        topics,
        studentId,
      );
      return res.status(200).json(questions);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
);

/**
 * GET /quiz/:quizId
 * Retrieves a quiz by ID.
 */
quizRouter.get('/:quizId', async (req: Request, res: Response) => {
  const { quizId } = req.params;
  try {
    const quiz = await quizService.getQuizById(quizId);
    if (quiz) {
      return res.status(200).json(quiz);
    } else {
      return res.status(404).json({ error: 'Quiz not found' });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /versioning/:quizId
 * Retrieves versioning lineage of a quiz by ID
 */
quizRouter.get('/versioning/:quizId', async (req: Request, res: Response) => {
  const { quizId } = req.params;
  try {
    const quiz = await quizService.getQuizAllVersionsById(quizId);
    if (quiz) {
      return res.status(200).json(quiz);
    } else {
      return res.status(404).json({ error: 'Quizzes not found' });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /quiz/student/:studentId
 * Retrieves quizzes by studentId.
 */
quizRouter.get('/student/:studentId', async (req: Request, res: Response) => {
  const { studentId } = req.params;
  try {
    const quizzes = await quizService.getQuizzesByStudentId(studentId);
    if (quizzes) {
      return res.status(200).json(quizzes);
    } else {
      return res.status(404).json({ error: 'No quizzes found.' });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /quiz/teacher/:teacherId
 * Retrieves quizzes by teacherId.
 */
quizRouter.get('/teacher/:teacherId', async (req: Request, res: Response) => {
  const { teacherId } = req.params;
  try {
    const quizzes = await quizService.getQuizzesByTeacherId(teacherId);
    if (quizzes) {
      return res.status(200).json(quizzes);
    } else {
      return res.status(404).json({ error: 'No quizzes found.' });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * POST /quiz/filter
 * Retrieves a list of quizzes based on filter criteria.
 */
quizRouter.post(
  '/filter',
  validateBodyQuizQuestionTopicsExist,
  validateBodySubjectsExist,
  validateBodyLevelsExist,
  validateBodyDifficultiesExist,
  async (req: Request, res: Response) => {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const offset = (+page - 1) * +pageSize;
      const filterOptions: QuizFilterOptions = {
        pageSize: +pageSize,
        offset,
        ...req.body,
      };
      const filteredQuizzes = await quizService.getFilteredQuizzes(
        filterOptions,
      );
      return res.status(200).json(filteredQuizzes);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * PUT /quiz/:quizId
 * Update an unpublished quiz by ID.
 */
quizRouter.put(
  '/:quizId',
  validateBodyQuizFormatValid,
  validateBodySubjectExists,
  validateBodyLevelsExist,
  validateBodyQuizQuestionTopicsExist,
  validateBodyQuizTeacherCreatedExists,
  validateBodyQuizOnQuizQuestionFormatValid,
  validateParamsQuizIsLatest,
  //validateParamsQuizHasNoTakes // validation removed; breaks updateQuiz allocatedTo
  async (req: Request, res: Response) => {
    const { quizId } = req.params;
    try {
      const quiz = await quizService.updateQuiz(quizId, req);
      if (quiz) {
        return res.status(200).json(quiz);
      } else {
        return res.status(404).json({ error: 'Quiz not found' });
      }
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
);

/**
 * PUT /quiz/published/:quizId
 * Update the version of a quiz question in a published quiz by quiz ID and triggers re-marking process.
 */
quizRouter.put(
  '/published/:quizId',
  validateBodyUpdatePublishedQuizFormatValid,
  validateBodyOldQuestionIdExists,
  validateBodyNewQuestionIdExists,
  validateBodyNewQuestionIdIsLaterVersionOfOldQuestionId,
  validateBodySubjectExists,
  validateBodyLevelsExist,
  validateBodyQuizQuestionTopicsExist,
  validateBodyQuizTeacherCreatedExists,
  validateParamsQuizIsLatest,
  async (req: Request, res: Response) => {
    const { quizId } = req.params;
    try {
      const quiz = await quizService.updatePublishedQuiz(quizId, req);
      if (quiz) {
        return res.status(200).json(quiz);
      } else {
        return res.status(404).json({ error: 'Quiz not found' });
      }
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
);

/**
 * DELETE /quiz/:quizId
 * Delete a quiz by ID.
 */
quizRouter.delete('/:quizId', async (req: Request, res: Response) => {
  const { quizId } = req.params;
  try {
    const quiz = await quizService.deleteQuiz(quizId);
    if (quiz) {
      return res.status(204).send();
    } else {
      return res.status(404).json({ error: 'Quiz not found' });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

export default quizRouter;
