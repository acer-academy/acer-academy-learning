import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { AssignmentAttemptService } from '../services/AssignmentAttemptService';
import {
  restrictBodyId,
  validateBodyAssignmentAttemptFormatValid,
  validateBodyAssignmentExists,
  validateBodyStudentExists,
} from '../middleware/validationMiddleware';

const assignmentAttemptRouter = Router();
const assignmentAttemptService = new AssignmentAttemptService();

assignmentAttemptRouter.post(
  '/',
  validateBodyAssignmentAttemptFormatValid,
  validateBodyAssignmentExists,
  validateBodyStudentExists,
  async (req, res) => {
    try {
      const assignmentAttemptData: Prisma.AssignmentAttemptCreateInput =
        req.body;
      const newAssignmentAttempt =
        await assignmentAttemptService.createAssignmentAttempt(
          assignmentAttemptData,
        );
      return res.status(200).json(newAssignmentAttempt);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

assignmentAttemptRouter.get('/', async (req, res) => {
  try {
    const allAssignmentAttempts =
      await assignmentAttemptService.getAllAssignmentAttempts();
    return res.status(200).json(allAssignmentAttempts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

assignmentAttemptRouter.get('/:assignmentAttemptId', async (req, res) => {
  try {
    const { assignmentAttemptId } = req.params;
    const assignmentAttempt =
      await assignmentAttemptService.getAssignmentAttemptById(
        assignmentAttemptId,
      );
    if (!assignmentAttempt) {
      return res.status(404).json({ error: 'Assignment attempt not found' });
    }
    return res.status(200).json(assignmentAttempt);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

assignmentAttemptRouter.put(
  '/:assignmentAttemptId',
  restrictBodyId,
  validateBodyAssignmentAttemptFormatValid,
  validateBodyAssignmentExists,
  validateBodyStudentExists,
  async (req, res) => {
    try {
      const { assignmentAttemptId } = req.params;
      const input: Prisma.AssignmentAttemptUpdateInput = req.body;
      const updatedAssignmentAttempt =
        await assignmentAttemptService.updateAssignmentAttempt(
          assignmentAttemptId,
          input,
        );
      if (!updatedAssignmentAttempt) {
        return res.status(404).json({ error: 'Assignment attempt not found' });
      }
      return res.status(200).json(updatedAssignmentAttempt);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

assignmentAttemptRouter.delete('/:assignmentAttemptId', async (req, res) => {
  try {
    const { assignmentAttemptId } = req.params;
    const updatedAssignmentAttempt =
      await assignmentAttemptService.deleteAssignmentAttempt(
        assignmentAttemptId,
      );
    if (!updatedAssignmentAttempt) {
      return res.status(404).json({ error: 'Assignment attempt not found' });
    }
    return res.status(200).json(updatedAssignmentAttempt);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default assignmentAttemptRouter;
