import { Prisma } from '@prisma/client';
import { Router } from 'express';
import QuizStatisticsService from '../services/QuizStatisticsService';

const quizStatisticsRouter = Router();
