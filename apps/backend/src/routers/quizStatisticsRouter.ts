import { Router } from 'express';
import QuizStatisticsService from '../services/QuizStatisticsService';
import { TakeAnswerService } from '../services/TakeAnswerService';

const quizStatisticsRouter = Router();
const takeAnswerService = new TakeAnswerService();

quizStatisticsRouter.get('/correctRate/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const correctRate = await QuizStatisticsService.correctRateByQestionId(
      questionId,
    );
    return res.status(200).json(correctRate);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

quizStatisticsRouter.get('/averageTime/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const averageTime = await QuizStatisticsService.averageTimeTakenByQestionId(
      questionId,
    );
    return res.status(200).json(averageTime);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

quizStatisticsRouter.get('/spiderChart/:quizId/:takeId', async (req, res) => {
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
});

export default quizStatisticsRouter;
