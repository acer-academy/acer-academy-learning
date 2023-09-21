import { Request, Response, NextFunction, Router } from 'express';
import { FaqTopicService } from '../services/FaqTopicService';
import { Prisma } from '@prisma/client';
import {
  restrictBodyId,
  validateParamsFaqTopicExists,
  validateBodyFaqTopicTitleNotEmpty,
  validateBodyFaqTopicTitleUnique,
} from '../middleware/validationMiddleware';

const faqTopicRouter = Router();
const faqTopicService = new FaqTopicService();

/**
 * POST /faq-topics/
 * Creates a new FAQ topic.
 */
faqTopicRouter.post(
  '/',
  validateBodyFaqTopicTitleNotEmpty,
  validateBodyFaqTopicTitleUnique,
  async (req: Request, res: Response) => {
    try {
      const faqTopicData: Prisma.FaqTopicCreateInput = req.body;
      const newFaqTopic = await faqTopicService.createFaqTopic(faqTopicData);
      return res.status(201).json(newFaqTopic);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
);

/**
 * GET /faq-topics/
 * Retrieves a list of all FAQ topics.
 */
faqTopicRouter.get('/', async (req: Request, res: Response) => {
  try {
    const faqTopics = await faqTopicService.getAllFaqTopics();
    return res.status(200).json(faqTopics);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /faq-topics/{faqTopicId}
 * Retrieves an FAQ topic by its unique ID.
 */
faqTopicRouter.get('/:faqTopicId', async (req: Request, res: Response) => {
  try {
    const { faqTopicId } = req.params;
    const faqTopic = await faqTopicService.getFaqTopicById(faqTopicId);

    if (!faqTopic) {
      return res.status(404).json({ error: 'FAQ topic not found' });
    }

    return res.status(200).json(faqTopic);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /faq-topics/{faqTopicId}
 * Updates an FAQ topic's information by its unique ID.
 */
faqTopicRouter.put(
  '/:faqTopicId',
  restrictBodyId,
  validateParamsFaqTopicExists,
  validateBodyFaqTopicTitleNotEmpty,
  validateBodyFaqTopicTitleUnique,
  async (req: Request, res: Response) => {
    try {
      const { faqTopicId } = req.params;
      const faqTopicData: Prisma.FaqTopicUpdateInput = req.body;

      const updatedFaqTopic = await faqTopicService.updateFaqTopic(
        faqTopicId,
        faqTopicData,
      );

      if (!updatedFaqTopic) {
        return res.status(404).json({ error: 'FAQ topic not found' });
      }

      return res.status(200).json(updatedFaqTopic);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * DELETE /faq-topics/{faqTopicId}
 * Deletes an FAQ topic by its unique ID.
 */
faqTopicRouter.delete(
  '/:faqTopicId',
  validateParamsFaqTopicExists,
  async (req: Request, res: Response) => {
    try {
      const { faqTopicId } = req.params;

      const deletedFaqTopic = await faqTopicService.deleteFaqTopic(faqTopicId);

      if (!deletedFaqTopic) {
        return res.status(404).json({ error: 'FAQ topic not found' });
      }

      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

export default faqTopicRouter;
