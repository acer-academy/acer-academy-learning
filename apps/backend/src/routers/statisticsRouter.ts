import { Response, Router } from 'express';
import { validateCookiesStudentExist } from '../middleware/validationMiddleware';
import SubjectStatisticsService from '../services/SubjectStatisticsService';

const statisticsRouter = Router();

statisticsRouter.get(
  '/subject-wise-student/',
  validateCookiesStudentExist,
  async (req, res: Response<any, { studentId: string }>) => {
    try {
      const studentId = res.locals.studentId;
      const result = await SubjectStatisticsService.getSubjectWiseAnalytics({
        studentId,
      });
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

export default statisticsRouter;
