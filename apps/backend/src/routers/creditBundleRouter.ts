import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { CreditBundleService } from '../services/CreditBundleService';
import {
  validateBodyCreditBundleNameUnique,
  validateBodyCreditBundleNameNotEmpty,
  validateBodyCreditBundleNumCreditsPositive,
  validateBodyCreditBundleBasePricePositive,
  validateCreditBundleIsActive,
  validateParamsCreditBundleExists,
  restrictBodyId,
} from '../middleware/validationMiddleware';

const creditBundleRouter = Router();
const creditBundleService = new CreditBundleService();

/**
 * POST /credit-bundles/
 * Creates a new credit bundle.
 */
creditBundleRouter.post(
  '/',
  validateBodyCreditBundleNameUnique,
  validateBodyCreditBundleNameNotEmpty,
  validateBodyCreditBundleNumCreditsPositive,
  validateBodyCreditBundleBasePricePositive,
  async (req, res) => {
    try {
      const creditBundleData: Prisma.CreditBundleCreateInput = req.body;
      const newCreditBundle = await creditBundleService.createCreditBundle(
        creditBundleData,
      );
      return res.status(200).json(newCreditBundle);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * GET /credit-bundles/
 * Retrieves a list of all credit bundles.
 */
creditBundleRouter.get('/', async (req, res) => {
  try {
    const allCreditBundles = await creditBundleService.getAllCreditBundles();
    return res.status(200).json(allCreditBundles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /credit-bundles/{creditBundleId}
 * Retrieves a credit bundle by its unique ID.
 */
creditBundleRouter.get('/:creditBundleId', async (req, res) => {
  try {
    const { creditBundleId } = req.params;
    const creditBundle = await creditBundleService.getCreditBundleById(
      creditBundleId,
    );
    if (!creditBundle) {
      return res.status(404).json({ error: 'Credit bundle not found' });
    }
    return res.status(200).json(creditBundle);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /credit-bundles/{creditBundleId}
 * Updates an active credit bundle's information by its unique ID.
 */
creditBundleRouter.put(
  '/:creditBundleId',
  restrictBodyId,
  validateBodyCreditBundleNameNotEmpty,
  validateBodyCreditBundleNumCreditsPositive,
  validateBodyCreditBundleBasePricePositive,
  validateCreditBundleIsActive,
  async (req, res) => {
    try {
      const { creditBundleId } = req.params;
      const input: Prisma.CreditBundleUpdateInput = req.body;
      const updatedCreditBundle = await creditBundleService.updateCreditBundle(
        creditBundleId,
        input,
      );
      if (!updatedCreditBundle) {
        return res.status(404).json({ error: 'Credit bundle not found' });
      }
      return res.status(200).json(updatedCreditBundle);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * DELETE /credit-bundles/{creditBundleId}
 * Deletes an FAQ article by its unique ID.
 */
creditBundleRouter.delete(
  '/:creditBundleId',
  validateParamsCreditBundleExists,
  async (req, res) => {
    try {
      const { creditBundleId } = req.params;

      const deletedCreditBundle = await creditBundleService.deleteCreditBundle(
        creditBundleId,
      );

      if (!deletedCreditBundle) {
        return res.status(404).json({ error: 'Credit bundle not found' });
      }

      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

export default creditBundleRouter;
