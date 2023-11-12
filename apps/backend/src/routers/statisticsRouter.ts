import { Response, Router } from 'express';
import {
  validateCookiesStudentExist,
  validateQueryTopicsExist,
} from '../middleware/validationMiddleware';
import SubjectStatisticsService from '../services/SubjectStatisticsService';
import { QuizQuestionTopicEnum } from '@prisma/client';

const statisticsRouter = Router();

statisticsRouter.get(
  '/subject-wise-student/',
  validateCookiesStudentExist,
  validateQueryTopicsExist,
  async (
    req,
    res: Response<any, { studentId: string; topics: QuizQuestionTopicEnum[] }>,
  ) => {
    try {
      const studentId = res.locals.studentId;
      const topics = res.locals.topics;
      console.log(topics);
      const result = await SubjectStatisticsService.getSubjectWiseAnalytics({
        studentId,
        topics,
      });
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

export default statisticsRouter;
