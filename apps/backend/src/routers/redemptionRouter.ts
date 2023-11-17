import { Request, Response, Router } from 'express';
import { RedemptionService } from '../services/RedemptionService';
import { Prisma } from '@prisma/client';

const redemptionRouter = Router();
const redemptionService = new RedemptionService();

redemptionRouter.post('/', async (req: Request, res: Response) => {
  try {
    const redemptionData: Prisma.RedemptionUncheckedCreateInput = req.body;
    const newRedemption = await redemptionService.createRedemption(
      redemptionData,
    );
    return res.status(201).json(newRedemption);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

redemptionRouter.get('/', async (req: Request, res: Response) => {
  try {
    const allRedemptions = await redemptionService.getAllRedemptions();
    return res.status(200).json(allRedemptions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

redemptionRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const redemption = await redemptionService.getRedemptionById(id);
    return res.status(200).json(redemption);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

redemptionRouter.get(
  '/student/:studentId',
  async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;
      const redemptions = await redemptionService.getAllRedemptionsByStudentId(
        studentId,
      );
      return res.status(200).json(redemptions);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

redemptionRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedRedemption = await redemptionService.markRedemptionAsRedeemed(
      id,
    );
    return res.status(200).json(updatedRedemption);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default redemptionRouter;
