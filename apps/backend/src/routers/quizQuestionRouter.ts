import { NextFunction, Request, Response, Router } from 'express';
import {
  QuizQuestionFilterOptions,
  QuizQuestionService,
} from '../services/QuizQuestionService';
import { Prisma } from '@prisma/client';
import {
  restrictBodyId,
  validateBodyAnswersNotEmpty,
  validateBodyDifficultyExists,
  validateBodyLevelsExist,
  validateBodyQuestionTextNotEmpty,
  validateBodyQuizQuestionFormatValid,
  validateBodyQuizQuestionStatusExists,
  validateBodyQuizQuestionTopicsExist,
  validateBodyQuizQuestionTypeExists,
  validateParamsQuizQuestionExists,
} from '../middleware/validationMiddleware';
import { QuizAnswerService } from '../services/QuizAnswerService';

const quizQuestionRouter = Router();
const quizQuestionService = new QuizQuestionService();

/**
 * POST /quiz-questions/
 * Creates a new quiz question.
 */
quizQuestionRouter.post(
  '/',
  validateBodyQuizQuestionFormatValid,
  validateBodyQuizQuestionTopicsExist,
  validateBodyLevelsExist,
  validateBodyDifficultyExists,
  validateBodyQuizQuestionStatusExists,
  validateBodyQuizQuestionTypeExists,
  validateBodyQuestionTextNotEmpty,
  validateBodyAnswersNotEmpty,
  async (req: Request, res: Response) => {
    try {
      req.body.answers = { createMany: { data: req.body.answers } };
      const questionData: Prisma.QuizQuestionCreateInput = req.body;
      const newQuestion = await quizQuestionService.createQuizQuestion(
        questionData,
      );
      return res.status(201).json(newQuestion);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
);

/**
 * GET /quiz-questions/
 * Retrieves a list of all quiz questions.
 */
quizQuestionRouter.get('/', async (req: Request, res: Response) => {
  try {
    const questions = await quizQuestionService.getAllQuizQuestions();
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /quiz-questions/{questionId}
 * Retrieves a quiz question by its unique ID.
 */
quizQuestionRouter.get(
  '/:questionId',
  validateParamsQuizQuestionExists,
  async (req: Request, res: Response) => {
    try {
      const { questionId } = req.params;
      const question = await quizQuestionService.getQuizQuestionById(
        questionId,
      );

      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      return res.status(200).json(question);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * POST /quiz-questions/filter
 * Retrieves a list of quiz questions based on filter criteria.
 */
quizQuestionRouter.post(
  '/filter',
  validateBodyQuizQuestionTopicsExist,
  validateBodyLevelsExist,
  validateBodyDifficultyExists,
  validateBodyQuizQuestionTypeExists,
  validateBodyQuizQuestionStatusExists,
  async (req: Request, res: Response) => {
    try {
      const filterOptions: QuizQuestionFilterOptions = req.body;
      const filteredQuestions =
        await quizQuestionService.getFilteredQuizQuestions(filterOptions);
      return res.status(200).json(filteredQuestions);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * PUT /quiz-questions/{questionId}
 * Updates a quiz question's information by its unique ID.
 */
quizQuestionRouter.put(
  '/:questionId',
  validateParamsQuizQuestionExists,
  restrictBodyId,
  validateBodyQuizQuestionTopicsExist,
  validateBodyLevelsExist,
  validateBodyDifficultyExists,
  validateBodyQuestionTextNotEmpty,
  validateBodyQuizQuestionStatusExists,
  validateBodyQuizQuestionTypeExists,
  validateBodyAnswersNotEmpty,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questionId } = req.params;

      const updatedQuestion = await quizQuestionService.updateQuizQuestion(
        questionId,
        req,
      );

      if (!updatedQuestion) {
        return res.status(404).json({ error: 'Question not found' });
      }

      return res.status(200).json(updatedQuestion);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * DELETE /quiz-questions/{questionId}
 * Deletes a quiz question by its unique ID.
 */
quizQuestionRouter.delete(
  '/:questionId',
  validateParamsQuizQuestionExists,
  async (req: Request, res: Response) => {
    try {
      const { questionId } = req.params;

      const deletedQuestion = await quizQuestionService.deleteQuizQuestion(
        questionId,
      );

      if (!deletedQuestion) {
        return res.status(404).json({ error: 'Question not found' });
      }

      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

export default quizQuestionRouter;
