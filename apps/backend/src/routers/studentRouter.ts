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
    const studentData: Prisma.StudentUncheckedCreateInput = req.body;
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
    jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        res.status(403).send({ message: 'Invalid token' });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id } = decoded;

        try {
          // Query the database to retrieve the admin by id
          const student = await StudentService.getStudentById(id);

          if (!student) {
            res.status(404).send({ message: 'User not found' });
          } else {
            // Destructure admin object to omit password and possibly other sensitive fields
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, centreId, ...user } = student;
            res.status(200).send(user); //returns user information without password
          }
        } catch (error) {
          // Handle database errors or any other errors that might occur
          res.status(500).send({ message: 'Internal Server Error' });
        }
      }
    });
  } else {
    res.status(401).send({ message: 'No token provided' });
  }
});

studentRouter.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    await StudentService.requestPasswordReset(email);
    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

studentRouter.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await StudentService.resetPassword(token, newPassword);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default studentRouter;
