import { Request, Response, Router } from 'express';
import { QuizAnswerService } from '../services/QuizAnswerService';
import { Prisma } from '@prisma/client';
import {
  restrictBodyId,
  validateBodyQuizAnswerAnswerNotEmpty,
  validateBodyQuizAnswerFormatValid,
  validateBodyQuizQuestionExists,
  validateParamsQuizAnswerExists,
} from '../middleware/validationMiddleware';

const quizAnswerRouter = Router();
const quizAnswerService = new QuizAnswerService();

/**
 * POST /quiz-answers/
 * Creates a new quiz answer.
 */
quizAnswerRouter.post(
  '/',
  restrictBodyId,
  validateBodyQuizAnswerFormatValid,
  validateBodyQuizQuestionExists,
  validateBodyQuizAnswerAnswerNotEmpty,
  async (req: Request, res: Response) => {
    try {
      const answerData: Prisma.QuizAnswerCreateInput = req.body;
      const newAnswer = await quizAnswerService.createQuizAnswer(answerData);
      return res.status(201).json(newAnswer);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
);

/**
 * GET /quiz-answers/
 * Retrieves a list of all quiz answers.
 */
quizAnswerRouter.get('/', async (req: Request, res: Response) => {
  try {
    const answers = await quizAnswerService.getAllQuizAnswers();
    return res.status(200).json(answers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /quiz-answers/:answerId
 * Retrieves a quiz answer by its unique ID.
 */
quizAnswerRouter.get(
  '/:answerId',
  validateParamsQuizAnswerExists,
  async (req: Request, res: Response) => {
    try {
      const { answerId } = req.params;
      const answer = await quizAnswerService.getQuizAnswerById(answerId);

      if (!answer) {
        return res.status(404).json({ error: 'Quiz answer not found' });
      }

      return res.status(200).json(answer);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * PUT /quiz-answers/:answerId
 * Updates a quiz answer's information by its unique ID.
 */
quizAnswerRouter.put(
  '/:answerId',
  restrictBodyId,
  validateParamsQuizAnswerExists,
  validateBodyQuizQuestionExists,
  validateBodyQuizAnswerAnswerNotEmpty,
  async (req: Request, res: Response) => {
    try {
      const { answerId } = req.params;
      const answerData: Prisma.QuizAnswerUpdateInput = req.body;

      const updatedAnswer = await quizAnswerService.updateQuizAnswer(
        answerId,
        answerData,
      );

      if (!updatedAnswer) {
        return res.status(404).json({ error: 'Quiz answer not found' });
      }

      return res.status(200).json(updatedAnswer);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * DELETE /quiz-answers/:answerId
 * Deletes a quiz answer by its unique ID.
 */
quizAnswerRouter.delete(
  '/:answerId',
  validateParamsQuizAnswerExists,
  async (req: Request, res: Response) => {
    try {
      const { answerId } = req.params;

      const deletedAnswer = await quizAnswerService.deleteQuizAnswer(answerId);

      if (!deletedAnswer) {
        return res.status(404).json({ error: 'Quiz answer not found' });
      }

      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

export default quizAnswerRouter;
