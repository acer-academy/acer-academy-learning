import { Request, Response, Router } from 'express';
import { TakeService } from '../services/TakeService';
import { Prisma } from '@prisma/client';

const takeRouter = Router();
const takeService = new TakeService();

/**
 * POST /take/
 * Creates a new take.
 */
takeRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newTake = await takeService.createTake(req);
    return res.status(201).json(newTake);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /take/
 * Retrieves all takes.
 */
takeRouter.get('/', async (req: Request, res: Response) => {
  try {
    const takes = await takeService.getAllTakes();
    return res.status(200).json(takes);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /take/:takeId
 * Retrieves a take by ID.
 */
takeRouter.get('/:takeId', async (req: Request, res: Response) => {
  const { takeId } = req.params;
  try {
    const take = await takeService.getTakeById(takeId);
    if (take) {
      return res.status(200).json(take);
    } else {
      return res.status(404).json({ error: 'Take not found' });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /take/student/:studentId
 * Retrieves a take by student ID.
 */
takeRouter.get('/student/:studentId', async (req: Request, res: Response) => {
  const { studentId } = req.params;
  try {
    const takes = await takeService.getTakesByStudent(studentId);
    if (takes) {
      return res.status(200).json(takes);
    } else {
      return res.status(404).json({ error: 'Takes not found' });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /take/quiz/:quizId
 * Retrieves a take by quiz ID.
 */
takeRouter.get('/quiz/:quizId', async (req: Request, res: Response) => {
  const { quizId } = req.params;
  try {
    const takes = await takeService.getTakesByQuiz(quizId);
    if (takes) {
      return res.status(200).json(takes);
    } else {
      return res.status(404).json({ error: 'Takes not found' });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * DELETE /take/:takeId
 * Deletes a take by its unique ID.
 */
takeRouter.delete('/:takeId', async (req: Request, res: Response) => {
  try {
    const { takeId } = req.params;
    const deletedTake = await takeService.deleteTake(takeId);
    if (!deletedTake) {
      return res.status(404).json({ error: 'Take not found' });
    }
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default takeRouter;
