import SessionDao from '../dao/SessionDao';
import { Session, Prisma } from '@prisma/client';

class SessionService {
  public async createSession(
    data: Prisma.SessionUncheckedCreateInput,
    studentIdArr: Array<String>,
  ): Promise<Session> {
    const available = await this.checkClassroomAvailability(
      data.classroomId,
      data.start.toString(),
      data.end.toString(),
    );
    if (!available) {
      if (studentIdArr.length > 0) {
        const formattedData = {
          ...data,
          students: {
            connect: studentIdArr?.map((studentId: string) => ({
              id: studentId,
            })),
          },
        };
        return await SessionDao.createSession(formattedData);
      }
      return SessionDao.createSession(data);
    } else {
      throw new Error(
        'Unable to create session because another session is already using the classroom.',
      );
    }
  }

  public async getFutureSessionsOfClass(classId: string): Promise<Session[]> {
    return SessionDao.getFutureSessionsOfClass(classId);
  }

  public async getSessionsByClassId(classId: string): Promise<Session[]> {
    return SessionDao.getSessionsByClassId(classId);
  }

  public async updateSession(
    id: string,
    data: Prisma.SessionUncheckedUpdateInput,
    studentIdArr: Array<String>,
  ): Promise<Session> {
    const session = await this.getSessionBySessionId(id);
    let formattedData = {};
    if (studentIdArr.length > 0) {
      formattedData = {
        ...data,
        students: {
          connect: studentIdArr?.map((studentId: string) => ({
            id: studentId,
          })),
        },
      };
    }
    if (
      data.start &&
      data.end &&
      (session.start !== data.start || session.end !== data.end)
    ) {
      const available = await this.checkClassroomAvailability(
        session.classroomId,
        data.start.toString(),
        data.end.toString(),
      );
      if (!available || available === id) {
        return await SessionDao.updateSession(id, formattedData);
      }
      throw new Error(
        'Unable to update session because another session is already using the classroom.',
      );
    }
    return SessionDao.updateSession(id, formattedData);
  }

  public async bookSession(
    studentId: string,
    sessionId: string,
  ): Promise<Session> {
    const payload = {
      students: {
        connect: { id: studentId },
      },
    };

    return this.updateSession(sessionId, payload, []);
  }

  public async cancelBookedSession(
    studentId: string,
    sessionId: string,
  ): Promise<Session> {
    const payload = {
      students: {
        disconnect: { id: studentId },
      },
    };

    return this.updateSession(sessionId, payload, []);
  }

  public async deleteSession(id: string): Promise<Session> {
    return SessionDao.deleteSession(id);
  }

  public async getSessionBySessionId(id: string): Promise<Session> {
    return SessionDao.getSessionBySessionId(id);
  }

  public async getAllSessions(): Promise<Session[]> {
    return SessionDao.getAllSessions();
  }

  private async checkClassroomAvailability(
    classroomId: string,
    start: string,
    end: string,
  ) {
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);
    return SessionDao.checkClassroomAvailability(
      classroomId,
      startDateTime,
      endDateTime,
    );
  }
}

export default new SessionService();
