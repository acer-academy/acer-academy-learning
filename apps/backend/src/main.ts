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
import teacherRouter from './routers/teacherRouter';
import centreRouter from './routers/centreRouter';
import faqArticleRouter from './routers/faqArticleRouter';
import faqTopicRouter from './routers/faqTopicRouter';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const port: number = parseInt(process.env.PORT as string, 10);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to backend!' });
});

// Routes
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/teachers', teacherRouter);
app.use('/api/v1/centres', centreRouter);
app.use('/api/v1/faqArticle', faqArticleRouter);
app.use('/api/v1/faqTopic', faqTopicRouter);

// Start the server
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
server.on('error', console.error);
