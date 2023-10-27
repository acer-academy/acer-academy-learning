import { Request, Response, Router } from 'express';
import { TakeAnswerService } from '../services/TakeAnswerService';
import { Prisma } from '@prisma/client';
import {
  restrictBodyId,
  validateBodyTakeAnswerFormatValid,
  validateBodyQuizQuestionExists,
  validateBodyTakeExists,
} from '../middleware/validationMiddleware';

const takeAnswerRouter = Router();
const takeAnswerService = new TakeAnswerService();

/**
 * POST /take-answers/
 * Creates a new take answer.
 */
takeAnswerRouter.post(
  '/',
  validateBodyTakeAnswerFormatValid,
  validateBodyQuizQuestionExists,
  async (req: Request, res: Response) => {
    try {
      const takeAnswerData: Prisma.TakeAnswerCreateInput = req.body;
      const newTakeAnswer = await takeAnswerService.createTakeAnswer(
        takeAnswerData,
      );
      return res.status(201).json(newTakeAnswer);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
);

/**
 * GET /take-answers/
 * Retrieves all take answers.
 */
takeAnswerRouter.get('/', async (req: Request, res: Response) => {
  try {
    const takes = await takeAnswerService.getAllTakeAnswers();
    return res.status(200).json(takes);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /take-answers/:takeAnswerId
 * Retrieves a take by ID.
 */
takeAnswerRouter.get('/:takeAnswerId', async (req: Request, res: Response) => {
  const { takeAnswerId } = req.params;
  try {
    const take = await takeAnswerService.getTakeAnswerById(takeAnswerId);
    if (take) {
      return res.status(200).json(take);
    } else {
      return res.status(404).json({ error: 'Take answer not found' });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /take-answers/student/:studentId
 * Retrieves take answers by student ID.
 */
takeAnswerRouter.get(
  '/student/:studentId',
  async (req: Request, res: Response) => {
    const { studentId } = req.params;
    try {
      const takeAnswers = await takeAnswerService.getTakeAnswersByStudent(
        studentId,
      );
      if (takeAnswers) {
        return res.status(200).json(takeAnswers);
      } else {
        return res.status(404).json({ error: 'Take answers not found' });
      }
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
);

/**
 * GET /take-answers/take/:takeId
 * Retrieves take answers by take ID.
 */
takeAnswerRouter.get('/take/:takeId', async (req: Request, res: Response) => {
  const { takeId } = req.params;
  try {
    const takeAnswers = await takeAnswerService.getTakeAnswersByTake(takeId);
    if (takeAnswers) {
      return res.status(200).json(takeAnswers);
    } else {
      return res.status(404).json({ error: 'Take answers not found' });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /take-answers/question/:quizQuestionId
 * Retrieves take answers by quiz question ID.
 */
takeAnswerRouter.get(
  '/question/:quizQuestionId',
  async (req: Request, res: Response) => {
    const { quizQuestionId } = req.params;
    try {
      const takeAnswers = await takeAnswerService.getTakeAnswersByQuizQuestion(
        quizQuestionId,
      );
      if (takeAnswers) {
        return res.status(200).json(takeAnswers);
      } else {
        return res.status(404).json({ error: 'Take answers not found' });
      }
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
);

/**
 * PUT /take-answers/:takeAnswerId
 * Updates a take answer's information by its unique ID.
 */
takeAnswerRouter.put(
  '/:takeAnswerId',
  restrictBodyId,
  validateBodyQuizQuestionExists,
  validateBodyTakeExists,
  async (req: Request, res: Response) => {
    try {
      const { takeAnswerId } = req.params;
      const takeAnswerData: Prisma.TakeAnswerUpdateInput = req.body;

      const updatedTakeAnswer = await takeAnswerService.updateTakeAnswer(
        takeAnswerId,
        takeAnswerData,
      );

      if (!updatedTakeAnswer) {
        return res.status(404).json({ error: 'Take answer not found' });
      }

      return res.status(200).json(updatedTakeAnswer);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * DELETE /take-answers/:takeAnswerId
 * Deletes a take answer by its unique ID.
 */
takeAnswerRouter.delete(
  '/:takeAnswerId',
  async (req: Request, res: Response) => {
    try {
      const { takeAnswerId } = req.params;
      const deletedTakeAnswer = await takeAnswerService.deleteTakeAnswer(
        takeAnswerId,
      );
      if (!deletedTakeAnswer) {
        return res.status(404).json({ error: 'Take answer not found' });
      }
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

export default takeAnswerRouter;
