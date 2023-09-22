import { Request, Response, NextFunction, Router } from 'express';
import { FaqArticleService } from '../services/FaqArticleService';
import { Prisma } from '@prisma/client';
import {
  restrictBodyId,
  validateBodyFaqArticleTitleBodyNotEmpty,
  validateBodyFaqTopicExists,
  validateParamsFaqArticleExists,
} from '../middleware/validationMiddleware';

const faqArticleRouter = Router();
const faqArticleService = new FaqArticleService();

/**
 * POST /faq-articles/
 * Creates a new FAQ article.
 */
faqArticleRouter.post(
  '/',
  validateBodyFaqArticleTitleBodyNotEmpty,
  validateBodyFaqTopicExists,
  async (req: Request, res: Response) => {
    try {
      const faqArticleData: Prisma.FaqArticleCreateInput = req.body;
      const newFaqArticle = await faqArticleService.createFaqArticle(
        faqArticleData,
      );
      return res.status(201).json(newFaqArticle);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
);

/**
 * GET /faq-articles/
 * Retrieves a list of all FAQ articles.
 */
faqArticleRouter.get('/', async (req: Request, res: Response) => {
  try {
    const faqArticles = await faqArticleService.getAllFaqArticles();
    return res.status(200).json(faqArticles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /faq-articles/{faqArticleId}
 * Retrieves an FAQ article by its unique ID.
 */
faqArticleRouter.get('/:faqArticleId', async (req: Request, res: Response) => {
  try {
    const { faqArticleId } = req.params;
    const faqArticle = await faqArticleService.getFaqArticleById(faqArticleId);

    if (!faqArticle) {
      return res.status(404).json({ error: 'FAQ article not found' });
    }

    return res.status(200).json(faqArticle);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /faq-articles/topic/{faqTopicId}
 * Retrieves a list of FAQ articles by the ID of the FAQ topic it belongs to.
 */
faqArticleRouter.get(
  '/topic/:faqTopicId',
  async (req: Request, res: Response) => {
    try {
      const { faqTopicId } = req.params;
      const faqArticles = await faqArticleService.getFaqArticleByFaqTopicId(
        faqTopicId,
      );
      return res.status(200).json(faqArticles);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * PUT /faq-articles/{faqArticleId}
 * Updates an FAQ article's information by its unique ID.
 */
faqArticleRouter.put(
  '/:faqArticleId',
  restrictBodyId,
  validateParamsFaqArticleExists,
  validateBodyFaqArticleTitleBodyNotEmpty,
  validateBodyFaqTopicExists,
  async (req: Request, res: Response) => {
    try {
      const { faqArticleId } = req.params;
      const faqArticleData: Prisma.FaqArticleUpdateInput = req.body;

      const updatedFaqArticle = await faqArticleService.updateFaqArticle(
        faqArticleId,
        faqArticleData,
      );

      if (!updatedFaqArticle) {
        return res.status(404).json({ error: 'FAQ article not found' });
      }

      return res.status(200).json(updatedFaqArticle);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * DELETE /faq-articles/{faqArticleId}
 * Deletes an FAQ article by its unique ID.
 */
faqArticleRouter.delete(
  '/:faqArticleId',
  validateParamsFaqArticleExists,
  async (req: Request, res: Response) => {
    try {
      const { faqArticleId } = req.params;

      const deletedFaqArticle = await faqArticleService.deleteFaqArticle(
        faqArticleId,
      );

      if (!deletedFaqArticle) {
        return res.status(404).json({ error: 'FAQ article not found' });
      }

      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

export default faqArticleRouter;
