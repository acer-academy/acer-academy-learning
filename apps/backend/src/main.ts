/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import * as path from 'path';
import studentRouter from './routers/studentRouter';
import adminRouter from './routers/adminRouter';
import promotionRouter from './routers/promotionRouter';
import teacherRouter from './routers/teacherRouter';
import centreRouter from './routers/centreRouter';
import cookieParser from 'cookie-parser';
import classroomRouter from './routers/classroomRouter';
import faqArticleRouter from './routers/faqArticleRouter';
import faqTopicRouter from './routers/faqTopicRouter';
import notificationPreferenceRouter from './routers/notificationPreferenceRouter';
import whitelistRouter from './routers/whitelistRouter';
import transactionRouter from './routers/transactionRouter';
import termRouter from './routers/termRouter';
import creditBundleRouter from './routers/creditBundleRouter';
import quizQuestionRouter from './routers/quizQuestionRouter';
import quizAnswerRouter from './routers/quizAnswerRouter';
import stripeWebhookRouter from './routers/stripeWebhookRouter';
import classRouter from './routers/classRouter';
import sessionRouter from './routers/sessionRouter';
import quizRouter from './routers/quizRouter';
import takeRouter from './routers/takeRouter';
import quizStatisticsRouter from './routers/quizStatisticsRouter';
import takeAnswerRouter from './routers/takeAnswerRouter';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const port: number = parseInt(process.env.PORT as string, 10);

const app = express();

// app.use(cors());

// Change this to deployed website URL later on for all 3 frontends
// app.use(
//   cors({
//     origin: 'http://localhost:3001', // Note the "https" here
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // You could add a list of allowed origins and check against that too
      if (
        origin.startsWith('http://localhost:') ||
        origin.startsWith('https://localhost:')
      ) {
        return callback(null, true);
      }

      // To allow specific domains, add them above this line as additional checks

      // If the origin doesn't match any criteria, reject it
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(express.json({ limit: '50mb' }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to backend!' });
});

// Routes
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/promotions', promotionRouter);
app.use('/api/v1/teachers', teacherRouter);
app.use('/api/v1/centres', centreRouter);
app.use('/api/v1/classrooms', classroomRouter);
app.use('/api/v1/faq-articles', faqArticleRouter);
app.use('/api/v1/faq-topics', faqTopicRouter);
app.use('/api/v1/preferences', notificationPreferenceRouter);
app.use('/api/v1/whitelist', whitelistRouter);
app.use('/api/v1/terms', termRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/credit-bundles', creditBundleRouter);
app.use('/api/v1/quiz-questions', quizQuestionRouter);
app.use('/api/v1/quiz-answers', quizAnswerRouter);
app.use('/api/v1/stripe-webhook', stripeWebhookRouter);
app.use('/api/v1/classes', classRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/quiz', quizRouter);
app.use('/api/v1/take', takeRouter);
app.use('/api/v1/quiz-statistics', quizStatisticsRouter);
app.use('/api/v1/take-answers', takeAnswerRouter);

// Start the server
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
server.on('error', console.error);
