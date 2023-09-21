import { Prisma } from '@prisma/client';
import express from 'express';
import NotificationPreferenceService from '../services/NotificationPreferenceService';

const notificationPreferenceRouter = express.Router();

notificationPreferenceRouter.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const input: Prisma.NotificationPreferenceUpdateInput = req.body;
    const notificationPreference =
      await NotificationPreferenceService.updateNotificationPreference(
        id,
        input,
      );

    return res
      .status(200)
      .json({ notificationPreference: notificationPreference });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});
