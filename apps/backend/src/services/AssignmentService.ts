import { AssignmentDao, AssignmentIncludeAttempts } from '../dao/AssignmentDao';
import { Assignment, AssignmentAttempt, Prisma } from '@prisma/client';

type ConsolidatedAssignmentStatistics = {
  assignmentDetails: Partial<Assignment>;
  assignmentAttempts: AssignmentAttempt[];
  totalMarksArr: number[];
};
export class AssignmentService {
  constructor(private assignmentDao: AssignmentDao = new AssignmentDao()) {}

  public async createAssignment(
    assignmentData: Prisma.AssignmentCreateInput,
  ): Promise<Assignment | null> {
    return this.assignmentDao.createAssignment(assignmentData);
  }

  public async getAllAssignments(): Promise<Assignment[]> {
    return this.assignmentDao.getAllAssignments();
  }

  public async getAssignmentById(
    assignmentId: string,
  ): Promise<AssignmentIncludeAttempts | null> {
    return this.assignmentDao.getAssignmentById(assignmentId);
  }

  public async getAssignmentStatisticsById(
    assignmentId: string,
  ): Promise<ConsolidatedAssignmentStatistics> {
    const { assignmentAttempts, ...rest } = await this.getAssignmentById(
      assignmentId,
    );
    return {
      assignmentDetails: {
        ...rest,
      },
      assignmentAttempts: assignmentAttempts,
      totalMarksArr: assignmentAttempts.map(({ score }) => score),
    };
  }

  public async updateAssignment(
    assignmentId: string,
    assignmentData: Prisma.AssignmentUpdateInput,
  ): Promise<Assignment | null> {
    return this.assignmentDao.updateAssignment(assignmentId, assignmentData);
  }

  public async deleteAssignment(
    assignmentId: string,
  ): Promise<Assignment | null> {
    return this.assignmentDao.deleteAssignment(assignmentId);
  }
}
