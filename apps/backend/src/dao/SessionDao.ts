import { Session, Student, Prisma, PrismaClient } from '@prisma/client';

class SessionDao {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createSession(
    data: Prisma.SessionUncheckedCreateInput,
  ): Promise<Session> {
    return this.prisma.session.create({ data, include: { students: true } });
  }

  public async getAllSessions(): Promise<Session[]> {
    return this.prisma.session.findMany({
      include: {
        students: true,
        teacher: true,
        classroom: {
          include: {
            centre: true,
          },
        },
        class: true,
      },
      orderBy: [{ start: 'asc' }],
    });
  }

  public async getSessionsByStudentId(studentId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: {
        students: {
          some: {
            id: studentId,
          },
        },
      },
      include: {
        students: true,
        teacher: true,
        // attendances: true,
      },
      orderBy: [{ start: 'desc' }],
    });
  }

  public async getSessionsInPastWeekByTeacherId(
    teacherId: string,
  ): Promise<Session[]> {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    const end = new Date();
    end.setDate(end.getDate() + 1);
    return this.prisma.session.findMany({
      where: {
        teacherId,
        start: { gte: new Date(start) },
        end: { lte: new Date(end) },
      },
      include: {
        students: true,
        teacher: true,
      },
      orderBy: [{ start: 'desc' }],
    });
  }

  public async getSessionsInPastWeek(): Promise<Session[]> {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    const end = new Date();
    end.setDate(end.getDate() + 1);
    return this.prisma.session.findMany({
      where: {
        start: { gte: new Date(start) },
        end: { lte: new Date(end) },
      },
      include: {
        students: true,
        teacher: true,
      },
      orderBy: [{ start: 'desc' }],
    });
  }

  public async checkClassroomAvailability(
    classroomId: string,
    startDateTime: Date,
    endDateTime: Date,
  ): Promise<string> {
    const beforeStartAfterEnd = await this.prisma.session.findMany({
      where: {
        classroomId,
        start: { lte: startDateTime },
        end: { gte: endDateTime },
      },
    });
    const afterStartBeforeEnd = await this.prisma.session.findMany({
      where: {
        classroomId,
        start: { gte: startDateTime },
        end: { lte: endDateTime },
      },
    });
    const afterStartAfterEnd = await this.prisma.session.findMany({
      where: {
        classroomId,
        start: { lt: endDateTime },
        end: { gte: endDateTime },
      },
    });
    const beforeStartBeforeEnd = await this.prisma.session.findMany({
      where: {
        classroomId,
        start: { lte: startDateTime },
        end: { gt: startDateTime },
      },
    });
    const classes = beforeStartAfterEnd
      .concat(afterStartAfterEnd)
      .concat(afterStartBeforeEnd)
      .concat(beforeStartBeforeEnd);
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
      include: {
        students: true,
      },
    });
  }

  public async getSessionBySessionId(id: string): Promise<Session> {
    return this.prisma.session.findUnique({
      where: { id },
      include: { teacher: true, class: true, classroom: true, students: true },
    });
  }

  public async getStudentsInSession(sessionId: string): Promise<Student[]> {
    return this.prisma.student.findMany({
      where: {
        sessions: {
          some: {
            id: sessionId,
          },
        },
      },
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
      include: { students: true },
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
