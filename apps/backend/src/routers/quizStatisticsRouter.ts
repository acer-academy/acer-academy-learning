import { Router } from 'express';
import QuizStatisticsService from '../services/QuizStatisticsService';
import {
  validateParamsQuizExists,
  validateParamsStudentExist,
  validateQuestionQuizTakeExist,
} from '../middleware/validationMiddleware';
import { AllTakesStudentParams } from '../types/takes';

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
  '/student-quizzes/:quizId/:studentId',
  validateParamsQuizExists,
  validateParamsStudentExist,
  async (req, res) => {
    try {
      const { quizId, studentId } = req.params;
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
      const filter: AllTakesStudentParams = {
        quizId: quizId,
        studentId: studentId,
      };

      if (startDate && typeof startDate === 'string') {
        filter.startDate = startDate;
      }

      if (endDate && typeof endDate === 'string') {
        filter.endDate = endDate;
      }
      filter.select = {
        attemptedAt: true,
        marks: true,
      };
      const quizStatistics =
        await QuizStatisticsService.getQuizStatisticsFilteredBy(filter);
      const totalMarks = await QuizStatisticsService.getTotalMarksByQuizId(
        quizId,
      );
      return res.status(200).json({
        takes: quizStatistics,
        totalMarks: totalMarks,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

export default quizStatisticsRouter;
