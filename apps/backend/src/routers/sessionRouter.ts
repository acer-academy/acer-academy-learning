import SessionService from '../services/SessionService';
import { Prisma } from '@prisma/client';
import { Router } from 'express';

const sessionRouter = Router();

sessionRouter.get('/', async (req, res) => {
  try {
    const sessions = await SessionService.getAllSessions();
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

sessionRouter.post('/', async (req, res) => {
  try {
    const input: Prisma.SessionUncheckedCreateInput = req.body;
    const session = await SessionService.createSession(input);
    return res.status(200).json(session);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

sessionRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const input: Prisma.SessionUncheckedUpdateInput = req.body;
    const session = await SessionService.updateSession(id, input);
    return res.status(200).json(session);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

sessionRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await SessionService.deleteSession(id);
    return res.status(200).json('Session Deleted Successfully');
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default sessionRouter;