import { Prisma, PrismaClient, AssignmentAttempt } from '@prisma/client';

export class AssignmentAttemptDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createAssignmentAttempt(
    answerData: Prisma.AssignmentAttemptCreateInput,
  ): Promise<AssignmentAttempt> {
    return this.prismaClient.assignmentAttempt.create({
      data: answerData,
    });
  }

  public async getAllAssignmentAttempts(): Promise<AssignmentAttempt[]> {
    return this.prismaClient.assignmentAttempt.findMany();
  }

  public async getAssignmentAttemptById(
    assignmentAttemptId: string,
  ): Promise<AssignmentAttempt | null> {
    return this.prismaClient.assignmentAttempt.findUnique({
      where: { id: assignmentAttemptId },
    });
  }

  public async getAssignmentAttemptsByAssignmentId(
    assignmentId: string,
  ): Promise<AssignmentAttempt[]> {
    return this.prismaClient.assignmentAttempt.findMany({
      where: { assignmentId: assignmentId },
      include: {
        student: true,
        assignment: {
          select: {
            title: true,
            totalMarks: true,
          },
        },
      },
    });
  }

  public async updateAssignmentAttempt(
    assignmentAttemptId: string,
    assignmentAttemptData: Prisma.AssignmentAttemptUpdateInput,
  ): Promise<AssignmentAttempt | null> {
    return this.prismaClient.assignmentAttempt.update({
      where: { id: assignmentAttemptId },
      data: assignmentAttemptData,
    });
  }

  public async deleteAssignmentAttempt(
    assignmentAttemptId: string,
  ): Promise<AssignmentAttempt | null> {
    return this.prismaClient.assignmentAttempt.delete({
      where: { id: assignmentAttemptId },
    });
  }
}
