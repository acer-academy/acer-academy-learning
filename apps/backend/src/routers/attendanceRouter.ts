import { Router } from 'express';
import { Prisma } from '@prisma/client';
import AttendanceService from '../services/AttendanceService';
import {
  validateBodyStudentExists,
  validateBodySessionExist,
  validateAttendanceParamExist,
  validateCurrentTermExist,
  validateAttendanceNotTaken,
  validateClassAndSessionExist,
} from '../middleware/validationMiddleware';

const attendanceRouter = Router();

attendanceRouter.get('/', async (req, res) => {
  try {
    const attendances = await AttendanceService.getAllAttendances();
    return res.status(200).json(attendances);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

attendanceRouter.get('/:id', validateAttendanceParamExist, async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await AttendanceService.getAttendanceById(id);
    return res.status(200).json(attendance);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

attendanceRouter.post(
  '/',
  validateBodyStudentExists,
  validateCurrentTermExist,
  validateBodySessionExist,
  validateAttendanceNotTaken,
  async (req, res) => {
    try {
      const input: Prisma.AttendanceUncheckedCreateInput = req.body;
      const attendanceAndTransactiion =
        await AttendanceService.createAttendance(input);
      return res.status(200).json(attendanceAndTransactiion);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

attendanceRouter.post(
  '/mark/:sessionId',
  validateClassAndSessionExist,
  validateCurrentTermExist,
  async (req, res) => {
    try {
      const { sessionId } = req.params;
      const studentIdArr: Array<string> = req.body;
      const attendances = await AttendanceService.markMultipleAttendances(
        studentIdArr,
        sessionId,
      );
      return res.status(200).json(attendances);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

attendanceRouter.put(
  '/revert/:id',
  validateAttendanceParamExist,
  async (req, res) => {
    try {
      const { id } = req.params;
      const attendanceAndTransactiion =
        await AttendanceService.revertAttendance(id);
      return res.status(200).json(attendanceAndTransactiion);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

export default attendanceRouter;
