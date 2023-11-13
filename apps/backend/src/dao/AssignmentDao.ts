import {
  Prisma,
  PrismaClient,
  Assignment,
  AssignmentAttempt,
} from '@prisma/client';

export type AssignmentIncludeAttempts = Assignment & {
  assignmentAttempts: AssignmentAttempt[];
};

export class AssignmentDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createAssignment(
    answerData: Prisma.AssignmentCreateInput,
  ): Promise<Assignment> {
    return this.prismaClient.assignment.create({
      data: answerData,
    });
  }

  public async getAllAssignments(): Promise<Assignment[]> {
    return this.prismaClient.assignment.findMany({
      include: {
        teacher: true,
        assignmentAttempts: true,
      },
    });
  }

  public async getAssignmentById(
    assignmentId: string,
  ): Promise<AssignmentIncludeAttempts | null> {
    return this.prismaClient.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        teacher: true,
        assignmentAttempts: true,
      },
    });
  }

  public async updateAssignment(
    assignmentId: string,
    assignmentData: Prisma.AssignmentUpdateInput,
  ): Promise<Assignment | null> {
    return this.prismaClient.assignment.update({
      where: { id: assignmentId },
      data: assignmentData,
    });
  }

  public async deleteAssignment(
    assignmentId: string,
  ): Promise<Assignment | null> {
    const deleteAttempts = await this.prismaClient.assignmentAttempt.deleteMany(
      {
        where: {
          assignmentId: assignmentId,
        },
      },
    );

    return this.prismaClient.assignment.delete({
      where: { id: assignmentId },
    });
  }
}
