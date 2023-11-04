import { AssignmentDao } from '../dao/AssignmentDao';
import { Assignment, Prisma } from '@prisma/client';

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
  ): Promise<Assignment | null> {
    return this.assignmentDao.getAssignmentById(assignmentId);
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
