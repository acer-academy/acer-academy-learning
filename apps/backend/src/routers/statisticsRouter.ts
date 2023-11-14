import { Response, Router } from 'express';
import {
  validateCookiesStudentExist,
  validateParamsSubjectExists,
  validateQueryTopicsExist,
} from '../middleware/validationMiddleware';
import SubjectStatisticsService from '../services/SubjectStatisticsService';
import { QuizQuestionTopicEnum, SubjectEnum } from '@prisma/client';

const statisticsRouter = Router();

statisticsRouter.get(
  '/subject-wise-student/:subject',
  validateCookiesStudentExist,
  validateQueryTopicsExist,
  validateParamsSubjectExists,
  async (
    req,
    res: Response<any, { studentId: string; topics: QuizQuestionTopicEnum[] }>,
  ) => {
    try {
      const studentId = res.locals.studentId;
      const topics = res.locals.topics;
      const subject = req.params.subject as SubjectEnum;
      const result = await SubjectStatisticsService.getSubjectWiseAnalytics({
        studentId,
        topics,
        subject,
      });
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

export default statisticsRouter;
