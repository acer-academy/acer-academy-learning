import { LevelEnum, Prisma, SubjectEnum, Teacher } from '@prisma/client';
import { Request, Response, Router } from 'express';
import { TeacherService } from '../services/TeacherService';
import {
  restrictBodyEmail,
  restrictBodyId,
  validateBodyCentreExists,
  validateBodyFirstNameLastNameNotEmpty,
  validateParamsLevelExists,
  validateBodyLevelsExist,
  validateParamsSubjectExists,
  validateBodySubjectsExist,
  validateParamsTeacherExists,
  validateBodyTeacherEmailUnique,
} from '../middleware/validationMiddleware';

const teacherRouter = Router();
const teacherService = new TeacherService();

/**
 * POST /teacher/
 * Creates a new teacher.
 */
teacherRouter.post(
  '/',
  validateBodyTeacherEmailUnique,
  validateBodyFirstNameLastNameNotEmpty,
  validateBodyLevelsExist,
  validateBodySubjectsExist,
  validateBodyCentreExists,
  async (req: Request, res: Response) => {
    try {
      const teacherData: Prisma.TeacherCreateInput = req.body;
      const teacher: Teacher = await teacherService.createTeacher(teacherData);
      res.status(201).json(teacher);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

/**
 * GET /teacher/
 * Retrieves a list of all teachers.
 */
teacherRouter.get('/', async (req: Request, res: Response) => {
  try {
    const teachers: Teacher[] = await teacherService.getAllTeachers();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /teacher/{teacherId}
 * Retrieves a teacher by their unique ID.
 */
teacherRouter.get('/:teacherId', async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.params;
    const teacher: Teacher | null = await teacherService.getTeacherById(
      teacherId,
    );

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /teacher/centre/{centreId}
 * Retrieves teachers associated with a specific centre.
 */
teacherRouter.get('/centre/:centreId', async (req: Request, res: Response) => {
  try {
    const { centreId } = req.params;
    const teachers: Teacher[] = await teacherService.getTeachersByCentre(
      centreId,
    );

    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /teacher/subject/{subject}
 * Retrieves teachers who teach a specific subject.
 */
teacherRouter.get(
  '/subject/:subject',
  validateParamsSubjectExists,
  async (req: Request, res: Response) => {
    try {
      const { subject } = req.params;
      const teachers: Teacher[] = await teacherService.getTeachersBySubject(
        subject as SubjectEnum,
      );

      res.status(200).json(teachers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

/**
 * GET /teacher/level/{level}
 * Retrieves teachers who teach at a specific level.
 */
teacherRouter.get(
  '/level/:level',
  validateParamsLevelExists,
  async (req: Request, res: Response) => {
    try {
      const { level } = req.params;
      const teachers: Teacher[] = await teacherService.getTeachersByLevel(
        level as LevelEnum,
      );

      res.status(200).json(teachers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

/**
 * PUT /teacher/{teacherId}
 * Updates a teacher's information by their unique ID.
 */
teacherRouter.put(
  '/:teacherId',
  restrictBodyEmail,
  restrictBodyId,
  validateParamsTeacherExists,
  validateBodyFirstNameLastNameNotEmpty,
  validateBodyLevelsExist,
  validateBodySubjectsExist,
  validateBodyCentreExists,
  async (req: Request, res: Response) => {
    try {
      const { teacherId } = req.params;
      const teacherData: Prisma.TeacherUpdateInput = req.body;

      const updatedTeacher: Teacher | null = await teacherService.updateTeacher(
        teacherId,
        teacherData,
      );

      if (!updatedTeacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }

      res.status(200).json(updatedTeacher);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

/**
 * DELETE /teacher/{teacherId}
 * Deletes a teacher by their unique ID.
 */
teacherRouter.delete(
  '/:teacherId',
  validateParamsTeacherExists,
  async (req: Request, res: Response) => {
    try {
      const { teacherId } = req.params;
      const deletedTeacher: Teacher | null = await teacherService.deleteTeacher(
        teacherId,
      );

      if (!deletedTeacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

/**
 * POST /teacher/login
 * Logs in a teacher using their email and password.
 */
teacherRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Assuming teacherService is where the login method resides
    const teacher = await teacherService.login(email, password);

    if (!teacher) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default teacherRouter;
