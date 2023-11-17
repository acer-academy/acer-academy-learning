import { Request, Response, Router } from 'express';
import { RewardService } from '../services/RewardService';
import { Prisma } from '@prisma/client';

const rewardRouter = Router();
const rewardService = new RewardService();

rewardRouter.post('/', async (req: Request, res: Response) => {
  try {
    const rewardData: Prisma.RewardUncheckedCreateInput = req.body;
    const newReward = await rewardService.createReward(rewardData);
    return res.status(200).json(newReward);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

rewardRouter.get('/', async (req: Request, res: Response) => {
  try {
    const rewards = await rewardService.getAllRewards();
    return res.status(200).json(rewards);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

rewardRouter.get('/active', async (req: Request, res: Response) => {
  try {
    const rewards = await rewardService.getActiveRewards();
    return res.status(200).json(rewards);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

rewardRouter.get('/:rewardId', async (req: Request, res: Response) => {
  try {
    const { rewardId } = req.params;
    const reward = await rewardService.getRewardById(rewardId);
    return res.status(200).json(reward);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

rewardRouter.put('/:rewardId', async (req: Request, res: Response) => {
  try {
    const { rewardId } = req.params;
    const rewardData: Prisma.RewardUncheckedUpdateInput = req.body;
    const updatedReward = await rewardService.updateReward(
      rewardId,
      rewardData,
    );
    return res.status(200).json(updatedReward);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

rewardRouter.delete('/:rewardId', async (req: Request, res: Response) => {
  try {
    const { rewardId } = req.params;
    const deletedReward = await rewardService.deleteReward(rewardId);
    return res.status(200).json(deletedReward);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

rewardRouter.get('/points/:studentId', async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const points = await rewardService.getRewardPointsByStudentId(studentId);
    return res.status(200).json(points);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default rewardRouter;
