import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { NotificationPreferenceService } from '../services/NotificationPreferenceService';
import { restrictBodyId } from '../middleware/validationMiddleware';

const notificationPreferenceRouter = Router();
const notificationService = new NotificationPreferenceService();

notificationPreferenceRouter.put(
  '/:notificationPreferenceId',
  restrictBodyId,
  async (req, res) => {
    try {
      const { notificationPreferenceId } = req.params;
      const input: Prisma.NotificationPreferenceUpdateInput = req.body;
      const notificationPreference =
        await notificationService.updateNotificationPreference(
          notificationPreferenceId,
          input,
        );

      return res
        .status(200)
        .json({ notificationPreference: notificationPreference });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
  },
);

export default notificationPreferenceRouter;
