import { Prisma } from '@prisma/client';
import { Router } from 'express';
import ClassService from '../services/ClassService';

const classRouter = Router();

classRouter.get('/', async (req, res) => {
  try {
    const sessions = await ClassService.getAllClasses();
    return res.status(200).json(sessions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

classRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const getClass = await ClassService.getClassById(id);
    return res.status(200).json(getClass);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

classRouter.post('/', async (req, res) => {
  try {
    const input: Prisma.ClassUncheckedCreateInput = req.body;
    const newClass = await ClassService.createClass(input);
    return res.status(200).json(newClass);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

classRouter.post('/recurring/', async (req, res) => {
  try {
    const input = req.body;
    const classInput: Prisma.ClassUncheckedCreateInput = input[0];
    const sessionInput: Prisma.SessionUncheckedCreateInput = input[1];
    const sessions = await ClassService.createRecurringClass(
      classInput,
      sessionInput,
    );
    return res.status(200).json(sessions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

classRouter.put('/recurring/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const input = req.body;
    const classInput: Prisma.ClassUncheckedUpdateInput = input[0];
    const sessionInput: Prisma.SessionUncheckedUpdateInput = input[1];
    const session = await ClassService.updateRecurringClass(
      sessionId,
      classInput,
      sessionInput,
    );
    return res.status(200).json(session);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

classRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const input: Prisma.ClassUncheckedUpdateInput = req.body;
    const updatedClass = await ClassService.updateClass(id, input);
    return res.status(200).json(updatedClass);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

classRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ClassService.deleteRecurringClass(id);
    return res.status(200).json('All Recurring Sessions Deleted Successfully');
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default classRouter;
