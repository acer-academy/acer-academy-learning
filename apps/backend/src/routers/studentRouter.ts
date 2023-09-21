import express from 'express';
import StudentService from '../services/StudentService';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';

import { JWT_SECRET_KEY } from '../config/config';

const studentRouter = express.Router();

studentRouter.get('/getAllStudents', async (_, res) => {
  try {
    const students = await StudentService.getAllStudents();

    return res.status(200).json({ students: students });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

studentRouter.get('/getStudentById/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await StudentService.getStudentById(id);

    return res.status(200).json({ student: student });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

studentRouter.post('/create', async (req, res) => {
  try {
    const studentData: Prisma.StudentCreateInput = req.body;
    const student = await StudentService.createStudent(studentData);

    return res.status(200).json({ student: student });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

studentRouter.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await StudentService.deleteStudent(id);

    return res.status(200).json({ student: student });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

studentRouter.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const studentData: Prisma.StudentUpdateInput = req.body;
    const student = await StudentService.updateStudent(id, studentData);

    return res.status(200).json({ student: student });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

/**
 * POST /students/login
 * Logs in a student using their email and password, returns a cookie that lasts 4 hours, containing the JWT Token
 */
studentRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await StudentService.login(email, password);

    res.cookie('jwtToken_Student', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in production
      sameSite: 'strict',
      maxAge: 4 * 60 * 60 * 1000, // 4 hours (needs to be same expiry as the JWT token)
    });

    res.status(200).json(user); // send user data in the response body
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /students/logout
 * removes the cookie for the user who sent in the request
 */
studentRouter.post('/logout', (req, res) => {
  res
    .clearCookie('jwtToken_Student', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in production
      sameSite: 'strict',
    })
    .status(200)
    .send({ message: 'Logout successful' });
});

/**
 * GET /students/check-auth
 * Checks the token in the cookie and return the user information
 */
studentRouter.get('/check-auth', (req, res) => {
  const token = req.cookies.jwtToken_Student;

  if (token) {
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(403).send({ message: 'Invalid token' });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { iat, exp, ...user } = decoded;

        res.status(200).send(user);
      }
    });
  } else {
    res.status(401).send({ message: 'No token provided' });
  }
});

export default studentRouter;
