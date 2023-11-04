import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { AssignmentService } from '../services/AssignmentService';
import {
  restrictBodyId,
  validateBodyAssignmentFormatValid,
  validateBodyTeacherExists,
} from '../middleware/validationMiddleware';

const assignmentRouter = Router();
const assignmentService = new AssignmentService();

assignmentRouter.post(
  '/',
  validateBodyAssignmentFormatValid,
  validateBodyTeacherExists,
  async (req, res) => {
    try {
      const assignmentData: Prisma.AssignmentCreateInput = req.body;
      const newAssignment = await assignmentService.createAssignment(
        assignmentData,
      );
      return res.status(200).json(newAssignment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

assignmentRouter.get('/', async (req, res) => {
  try {
    const allAssignments = await assignmentService.getAllAssignments();
    return res.status(200).json(allAssignments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

assignmentRouter.get('/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await assignmentService.getAssignmentById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    return res.status(200).json(assignment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

assignmentRouter.put(
  '/:assignmentId',
  restrictBodyId,
  validateBodyAssignmentFormatValid,
  validateBodyTeacherExists,
  async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const input: Prisma.AssignmentUpdateInput = req.body;
      const updatedAssignment = await assignmentService.updateAssignment(
        assignmentId,
        input,
      );
      if (!updatedAssignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
      return res.status(200).json(updatedAssignment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

assignmentRouter.delete('/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const updatedAssignment = await assignmentService.deleteAssignment(
      assignmentId,
    );
    if (!updatedAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    return res.status(200).json(updatedAssignment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default assignmentRouter;
