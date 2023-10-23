import { Router } from 'express';
import QuizStatisticsService from '../services/QuizStatisticsService';
import { validateQuestionQuizTakeExist } from '../middleware/validationMiddleware';

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
  '/spiderChart/:quizId/:takeId',
  validateQuestionQuizTakeExist,
  async (req, res) => {
    try {
      const { quizId, takeId } = req.params;
      const spiderChart = await QuizStatisticsService.spiderChartAnalysis(
        quizId,
        takeId,
      );
      return res.status(200).json(spiderChart);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

export default quizStatisticsRouter;
