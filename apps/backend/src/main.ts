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
import cookieParser from 'cookie-parser';

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

// Start the server
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
server.on('error', console.error);
