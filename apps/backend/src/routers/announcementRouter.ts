import { Prisma } from '@prisma/client';
import { Request, Response, Router } from 'express';
import { AnnouncementService } from '../services/AnnouncementService';
import {
  restrictBodyId,
  validateBodyAnnouncementFormatValid,
  validateBodyTeacherExists,
  validateBodyAnnouncementCentresExist,
  validateParamsTeacherExists,
  validateParamStudentExists,
} from '../middleware/validationMiddleware';

const announcementRouter = Router();
const announcementService = new AnnouncementService();

announcementRouter.post(
  '/',
  validateBodyAnnouncementFormatValid,
  validateBodyTeacherExists,
  validateBodyAnnouncementCentresExist,
  async (req: Request, res: Response) => {
    try {
      const newAnnouncement = await announcementService.createAnnouncement(req);
      return res.status(200).json(newAnnouncement);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

announcementRouter.get('/', async (req: Request, res: Response) => {
  try {
    const allAnnouncements = await announcementService.getAllAnnouncements();
    return res.status(200).json(allAnnouncements);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

announcementRouter.get(
  '/teacher/:teacherId',
  validateParamsTeacherExists,
  async (req: Request, res: Response) => {
    try {
      const { teacherId } = req.params;
      const announcements =
        await announcementService.getAnnouncementsByTeacherId(teacherId);
      return res.status(200).json(announcements);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

announcementRouter.get(
  '/student/:studentId',
  validateParamStudentExists,
  async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;
      const announcements =
        await announcementService.getAnnouncementsByStudentId(studentId);
      return res.status(200).json(announcements);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

announcementRouter.get(
  '/:announcementId',
  async (req: Request, res: Response) => {
    try {
      const { announcementId } = req.params;
      const announcement = await announcementService.getAnnouncementById(
        announcementId,
      );
      if (!announcement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
      return res.status(200).json(announcement);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

announcementRouter.put(
  '/:announcementId',
  restrictBodyId,
  validateBodyAnnouncementFormatValid,
  validateBodyTeacherExists,
  validateBodyAnnouncementCentresExist,
  async (req: Request, res: Response) => {
    try {
      const { announcementId } = req.params;
      const updatedAnnouncement = await announcementService.updateAnnouncement(
        announcementId,
        req,
      );
      if (!updatedAnnouncement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
      return res.status(200).json(updatedAnnouncement);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

announcementRouter.delete(
  '/:announcementId',
  async (req: Request, res: Response) => {
    try {
      const { announcementId } = req.params;
      const updatedAnnouncement = await announcementService.deleteAnnouncement(
        announcementId,
      );
      if (!updatedAnnouncement) {
        return res.status(404).json({ error: 'Announcement not found' });
      }
      return res.status(200).json(updatedAnnouncement);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

export default announcementRouter;
