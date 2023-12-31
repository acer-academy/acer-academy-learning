import SessionService from '../services/SessionService';
import { Prisma } from '@prisma/client';
import { Router } from 'express';
import {
  validateClassTeacherClassroomExist,
  validateSubjectsAndLevelsExist,
  validateSessionDate,
  validateClassAndSessionExist,
  validateParamStudentExists,
  validateEnoughCapacity,
} from '../middleware/validationMiddleware';
import { MessageService, MessageTemplate } from '../services/MessageService';

const sessionRouter = Router();
const messageService = new MessageService();

sessionRouter.get('/', async (req, res) => {
  try {
    const sessions = await SessionService.getAllSessions();
    return res.status(200).json(sessions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

sessionRouter.get('/week/', async (req, res) => {
  try {
    const sessions = await SessionService.getSessionsInPastWeek();
    return res.status(200).json(sessions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

sessionRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await SessionService.getSessionBySessionId(id);
    return res.status(200).json(session);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

sessionRouter.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const sessions = await SessionService.getSessionsByStudentIdBeforeToday(
      studentId,
    );
    return res.status(200).json(sessions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

sessionRouter.get('/week/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const sessions = await SessionService.getSessionsInPastWeekByTeacherId(
      teacherId,
    );
    return res.status(200).json(sessions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

sessionRouter.post(
  '/',
  validateClassTeacherClassroomExist,
  validateSubjectsAndLevelsExist,
  validateSessionDate,
  async (req, res) => {
    try {
      const input: Prisma.SessionUncheckedCreateInput = req.body[0];
      const studentIdArr: Array<string> = req.body[1];
      const session = await SessionService.createSession(input, studentIdArr);
      // Send whatsapp message
      await messageService.sendWhatsappMessage(MessageTemplate.NEW_CLASS_ALERT);
      return res.status(200).json(session);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

sessionRouter.put(
  '/:id',
  validateClassTeacherClassroomExist,
  validateSubjectsAndLevelsExist,
  validateSessionDate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const input: Prisma.SessionUncheckedUpdateInput = req.body[0];
      const addStudentIdArr: Array<string> = req.body[1];
      const removeStudentIdArr: Array<string> = req.body[2];
      const session = await SessionService.updateSession(
        id,
        input,
        addStudentIdArr,
        removeStudentIdArr,
      );
      // Send whatsapp message
      await messageService.sendWhatsappMessage(
        MessageTemplate.UPDATE_CLASS_ALERT,
      );
      return res.status(200).json(session);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

sessionRouter.put(
  '/book/:sessionId/:studentId',
  validateClassAndSessionExist,
  validateEnoughCapacity,
  validateParamStudentExists,
  async (req, res) => {
    try {
      const { sessionId, studentId } = req.params;
      const session = await SessionService.bookSession(studentId, sessionId);
      return res.status(200).json(session);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

sessionRouter.put(
  '/cancel/:sessionId/:studentId',
  validateClassAndSessionExist,
  validateParamStudentExists,
  async (req, res) => {
    try {
      const { sessionId, studentId } = req.params;
      const session = await SessionService.cancelBookedSession(
        studentId,
        sessionId,
      );
      return res.status(200).json(session);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

sessionRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await SessionService.deleteSession(id);
    await messageService.sendWhatsappMessage(
      MessageTemplate.DELETED_CLASS_ALERT,
    );
    return res.status(200).json('Session Deleted Successfully');
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default sessionRouter;
