import { Request, Response, Router } from 'express';
import { ClassroomService } from '../services/ClassroomService';
import { Prisma } from '@prisma/client';
import {
  validateParamsClassroomExists,
  validateBodyClassroomNameNotEmpty,
  validateBodyClassroomCapacity,
  validateParamsCentreExists,
  restrictBodyId,
} from '../middleware/validationMiddleware';

const classroomRouter = Router();
const classroomService = new ClassroomService();

/**
 * POST /classroom/
 * Creates a new classroom.
 */
classroomRouter.post(
  '/',
  validateBodyClassroomNameNotEmpty,
  validateBodyClassroomCapacity,
  async (req: Request, res: Response) => {
    try {
      const classroomData: Prisma.ClassroomCreateInput = req.body;
      const newClassroom = await classroomService.createClassroom(
        classroomData,
      );
      return res.status(201).json(newClassroom);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: error.message,
      });
    }
  },
);

/**
 * GET /classroom/
 * Retrieves a list of all classrooms.
 */
classroomRouter.get('/', async (req: Request, res: Response) => {
  try {
    const classrooms = await classroomService.getAllClassrooms();
    return res.status(200).json(classrooms);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /classroom/{classroomId}
 * Retrieves a classroom by its unique ID.
 */
classroomRouter.get('/:classroomId', async (req: Request, res: Response) => {
  try {
    const { classroomId } = req.params;
    const classroom = await classroomService.getClassroomById(classroomId);

    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    return res.status(200).json(classroom);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /classroom/centre/{centreId}
 * Retrieves classrooms by centre's unique ID.
 */
classroomRouter.get(
  '/centre/:centreId',
  validateParamsCentreExists,
  async (req: Request, res: Response) => {
    try {
      const { centreId } = req.params;
      const classrooms = await classroomService.getClassroomsByCentre(centreId);

      return res.status(200).json(classrooms);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * PUT /classroom/{classroomId}
 * Updates a classroom's information by its unique ID.
 */
classroomRouter.put(
  '/:classroomId',
  restrictBodyId,
  validateParamsClassroomExists,
  validateBodyClassroomNameNotEmpty,
  validateBodyClassroomCapacity,
  async (req: Request, res: Response) => {
    try {
      const { classroomId } = req.params;
      const classroomData: Prisma.ClassroomUpdateInput = req.body;

      const updatedClassroom = await classroomService.updateClassroom(
        classroomId,
        classroomData,
      );

      if (!updatedClassroom) {
        return res.status(404).json({ error: 'Classroom not found' });
      }

      return res.status(200).json(updatedClassroom);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

/**
 * DELETE /classroom/{classroomId}
 * Deletes a classroom by its unique ID.
 */
classroomRouter.delete(
  '/:classroomId',
  validateParamsClassroomExists,
  async (req: Request, res: Response) => {
    try {
      const { classroomId } = req.params;

      const deletedClassroom = await classroomService.deleteClassroom(
        classroomId,
      );

      if (!deletedClassroom) {
        return res.status(404).json({ error: 'Classroom not found' });
      }

      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
);

export default classroomRouter;
