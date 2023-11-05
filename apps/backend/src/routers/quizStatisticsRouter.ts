import { Response, Router } from 'express';
import QuizStatisticsService from '../services/QuizStatisticsService';
import {
  validateCookiesStudentExist,
  validateParamsQuizExists,
  validateQuestionQuizTakeExist,
} from '../middleware/validationMiddleware';
import { AllTakesStudentParams } from '../types/takes';
import { QuizQuestionTopicEnum } from '@prisma/client';

const quizStatisticsRouter = Router();

quizStatisticsRouter.get(
  '/correctRate/:questionId',
  validateQuestionQuizTakeExist,
  async (req, res) => {
    try {
      const { questionId } = req.params;
      const correctRate = await QuizStatisticsService.correctRateByQuestionId(
        questionId,
      );
      return res.status(200).json(correctRate);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

quizStatisticsRouter.get(
  '/averageTime/:questionId',
  validateQuestionQuizTakeExist,
  async (req, res) => {
    try {
      const { questionId } = req.params;
      const averageTime =
        await QuizStatisticsService.averageTimeTakenByQuestionId(questionId);
      return res.status(200).json(averageTime);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

quizStatisticsRouter.get(
  '/spiderChart/:takeId',
  validateQuestionQuizTakeExist,
  async (req, res) => {
    try {
      const { takeId } = req.params;
      const spiderChart = await QuizStatisticsService.spiderChartAnalysis(
        takeId,
      );
      return res.status(200).json(spiderChart);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

quizStatisticsRouter.get(
  '/quiz/:quizId',
  validateParamsQuizExists,
  async (req, res) => {
    try {
      const { quizId } = req.params;
      const quizStatistics = await QuizStatisticsService.quizStatisticsByQuizId(
        quizId,
      );
      return res.status(200).json(quizStatistics);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

quizStatisticsRouter.get(
  '/student-quizzes/:quizId',
  validateParamsQuizExists,
  validateCookiesStudentExist,
  async (req, res: Response<any, { studentId: string }>) => {
    try {
      const studentId = res.locals.studentId;
      const { quizId } = req.params;
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
      const filter: AllTakesStudentParams = {
        quizIds: quizId ? [quizId] : undefined,
        studentId: studentId,
      };

      if (startDate && typeof startDate === 'string') {
        filter.startDate = startDate;
      }

      if (endDate && typeof endDate === 'string') {
        filter.endDate = endDate;
      }
      const quizStatistics =
        await QuizStatisticsService.getQuizStatisticsStudentTakesFilteredBy(
          filter,
        );
      const totalMarks = await QuizStatisticsService.getTotalMarksByQuizId(
        quizId,
      );
      return res.status(200).json({
        takes: quizStatistics,
        totalMarks: totalMarks,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * Based on query params, filter accordingly what to return for the Spider Chart
 */
quizStatisticsRouter.get(
  '/spider-chart-student',
  validateCookiesStudentExist,
  async (req, res: Response<any, { studentId: string }>) => {
    // const { studentId } = req.params;
    const studentId = res.locals.studentId;
    const filter: AllTakesStudentParams = {
      studentId: studentId,
    };
    const topics = req.query.topics as string | string[];
    const filteredTopics = Array.isArray(topics)
      ? topics.filter((topic): topic is QuizQuestionTopicEnum =>
          Object.values(QuizQuestionTopicEnum).includes(
            topic as QuizQuestionTopicEnum,
          ),
        )
      : Object.values(QuizQuestionTopicEnum).includes(
          topics as QuizQuestionTopicEnum,
        )
      ? [topics as QuizQuestionTopicEnum]
      : undefined;

    console.log(filteredTopics);

    const result =
      await QuizStatisticsService.getQuizStatisticsStudentSpiderChartDataBy({
        filter: filter,
        onlyAttemptedTopics: false,
        topics: filteredTopics,
      });
    return res.status(200).json(result);
  },
);

export default quizStatisticsRouter;
