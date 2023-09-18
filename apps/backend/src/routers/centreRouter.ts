import { Request, Response, NextFunction, Router } from 'express';
import { CentreService } from '../services/CentreService';
import { Prisma } from '@prisma/client';
import {
  restrictBodyId,
  validateParamsCentreDeletable,
  validateParamsCentreExists,
  validateBodyCentreNameAddressNotEmpty,
  validateBodyCentreNameAddressUnique,
} from '../middleware/validationMiddleware';

const centreRouter = Router();
const centreService = new CentreService();

/**
 * POST /centre/
 * Creates a new centre.
 */
centreRouter.post(
  '/',
  validateBodyCentreNameAddressUnique,
  validateBodyCentreNameAddressNotEmpty,
  async (req: Request, res: Response) => {
    try {
      const centreData: Prisma.CentreCreateInput = req.body;
      const newCentre = await centreService.createCentre(centreData);
      return res.status(201).json(newCentre);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  },
);

/**
 * GET /centre/
 * Retrieves a list of all centres.
 */
centreRouter.get('/', async (req: Request, res: Response) => {
  try {
    const centres = await centreService.getAllCentres();
    return res.status(200).json(centres);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /centre/{centreId}
 * Retrieves a centre by its unique ID.
 */
centreRouter.get('/:centreId', async (req: Request, res: Response) => {
  try {
    const { centreId } = req.params;
    const centre = await centreService.getCentreById(centreId);

    if (!centre) {
      return res.status(404).json({ error: 'Centre not found' });
    }

    return res.status(200).json(centre);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /centre/{centreId}
 * Updates a centre's information by its unique ID.
 */
centreRouter.put(
  '/:centreId',
  restrictBodyId,
  validateParamsCentreExists,
  validateBodyCentreNameAddressNotEmpty,
  async (req: Request, res: Response) => {
    try {
      const { centreId } = req.params;
      const centreData: Prisma.CentreUpdateInput = req.body;

      const updatedCentre = await centreService.updateCentre(
        centreId,
        centreData,
      );

      if (!updatedCentre) {
        return res.status(404).json({ error: 'Centre not found' });
      }

      return res.status(200).json(updatedCentre);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * DELETE /centre/{centreId}
 * Deletes a centre by its unique ID.
 */
centreRouter.delete(
  '/:centreId',
  validateParamsCentreExists,
  validateParamsCentreDeletable,
  async (req: Request, res: Response) => {
    try {
      const { centreId } = req.params;

      const deletedCentre = await centreService.deleteCentre(centreId);

      if (!deletedCentre) {
        return res.status(404).json({ error: 'Centre not found' });
      }

      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

export default centreRouter;
