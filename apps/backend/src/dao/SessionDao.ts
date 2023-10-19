import { Session, Prisma, PrismaClient } from '@prisma/client';

class SessionDao {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createSession(
    data: Prisma.SessionUncheckedCreateInput,
  ): Promise<Session> {
    return this.prisma.session.create({ data });
  }

  public async getAllSessions(): Promise<Session[]> {
    return this.prisma.session.findMany({
      include: {
        students: true,
        teacher: true,
        classroom: {
          include: {
            centre: true
          }
        },
        class: true,
      },
      orderBy: [{ start: 'asc' }],
    });
  }

  public async checkClassroomAvailability(
    classroomId: string,
    startDateTime: Date,
    endDateTime: Date,
  ): Promise<string> {
    const classes = await this.prisma.session.findMany({
      where: {
        classroomId,
        start: { lte: startDateTime },
        end: { gte: endDateTime },
      },
    });
    return classes.length > 0 ? classes[0].id : undefined;
  }

  public async getFutureSessions(): Promise<Session[]> {
    const currentDate = new Date();
    return this.prisma.session.findMany({
      where: {
        start: { gte: currentDate },
      },
      orderBy: [{ start: 'asc' }],
    });
  }

  public async getFutureSessionsOfClass(classId: string): Promise<Session[]> {
    const currentDate = new Date();
    return this.prisma.session.findMany({
      where: {
        start: { gte: currentDate },
        classId,
      },
      orderBy: [{ start: 'asc' }],
    });
  }

  public async getSessionsByClassId(classId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: {
        classId,
      },
    });
  }

  public async getSessionBySessionId(id: string): Promise<Session> {
    return this.prisma.session.findUnique({
      where: { id },
      include: { teacher: true, class: true, classroom: true },
    });
  }

  //when an individual class instance is updated
  public async updateSession(
    id: string,
    input: Prisma.SessionUncheckedUpdateInput,
  ): Promise<Session> {
    return this.prisma.session.update({
      where: { id },
      data: input,
    });
  }

  //when an individual class instance is deleted
  public async deleteSession(id: string): Promise<Session> {
    return this.prisma.session.delete({
      where: { id },
    });
  }
}

export default new SessionDao();
