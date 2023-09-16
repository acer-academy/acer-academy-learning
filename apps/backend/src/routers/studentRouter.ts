import express from 'express';
import { StudentPostData } from 'libs/data-access/src/lib/types/student';
import StudentService from '../services/StudentService';
import { mapPrismaStudentToStudentData } from '../utils/mapper';

const studentRouter = express.Router();

studentRouter.get('/getAllStudents', async (_, res) => {
  try {
    const students = await StudentService.getAllStudents();
    const formattedStudents = students.map((student) =>
      mapPrismaStudentToStudentData(student),
    );

    return res.status(200).json({ students: formattedStudents });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

studentRouter.post('/create', async (req, res) => {
  try {
    const input = req.body as StudentPostData;
    const student = await StudentService.createStudent(input);
    const formattedStudent = mapPrismaStudentToStudentData(student);

    return res.status(200).json({ student: formattedStudent });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

export default studentRouter;
