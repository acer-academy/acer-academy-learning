import { AssignmentAttemptDao } from '../dao/AssignmentAttemptDao';
import { AssignmentAttempt, Prisma } from '@prisma/client';

export class AssignmentAttemptService {
  constructor(
    private assignmentAttemptDao: AssignmentAttemptDao = new AssignmentAttemptDao(),
  ) {}

  public async createAssignmentAttempt(
    assignmentAttemptData: Prisma.AssignmentAttemptCreateInput,
  ): Promise<AssignmentAttempt | null> {
    return this.assignmentAttemptDao.createAssignmentAttempt(
      assignmentAttemptData,
    );
  }

  public async getAllAssignmentAttempts(): Promise<AssignmentAttempt[]> {
    return this.assignmentAttemptDao.getAllAssignmentAttempts();
  }

  public async getAssignmentAttemptById(
    assignmentAttemptId: string,
  ): Promise<AssignmentAttempt | null> {
    return this.assignmentAttemptDao.getAssignmentAttemptById(
      assignmentAttemptId,
    );
  }

  public async getAssignmentAttemptsByAssignmentId(
    assignmentId: string,
  ): Promise<AssignmentAttempt[]> {
    return this.assignmentAttemptDao.getAssignmentAttemptsByAssignmentId(
      assignmentId,
    );
  }

  public async updateAssignmentAttempt(
    assignmentAttemptId: string,
    assignmentAttemptData: Prisma.AssignmentAttemptUpdateInput,
  ): Promise<AssignmentAttempt | null> {
    return this.assignmentAttemptDao.updateAssignmentAttempt(
      assignmentAttemptId,
      assignmentAttemptData,
    );
  }

  public async deleteAssignmentAttempt(
    assignmentAttemptId: string,
  ): Promise<AssignmentAttempt | null> {
    return this.assignmentAttemptDao.deleteAssignmentAttempt(
      assignmentAttemptId,
    );
  }
}
