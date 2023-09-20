import express from 'express';
// import { StudentPostData } from 'libs/data-access/src/lib/types/student';
import StudentService from '../services/StudentService';
import { Prisma } from '@prisma/client';
// import { mapPrismaStudentToStudentData } from '../utils/mapper';

const studentRouter = express.Router();

studentRouter.get('/getAllStudents', async (_, res) => {
  try {
    const students = await StudentService.getAllStudents();
    // const formattedStudents = students.map((student) =>
    //   mapPrismaStudentToStudentData(student),
    // );

    return res.status(200).json({ students: students });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

studentRouter.post('/create', async (req, res) => {
  try {
    // const input = req.body as StudentPostData;
    const studentData: Prisma.StudentCreateInput = req.body;
    const student = await StudentService.createStudent(studentData);
    // const formattedStudent = mapPrismaStudentToStudentData(student);

    return res.status(200).json({ student: student });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

studentRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await StudentService.login(email, password);
    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default studentRouter;
