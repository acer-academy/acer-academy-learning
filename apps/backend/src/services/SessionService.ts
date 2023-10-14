import SessionDao from '../dao/SessionDao';
import { Session, Prisma } from '@prisma/client';

class SessionService {
  public async createSession(
    data: Prisma.SessionUncheckedCreateInput,
  ): Promise<Session> {
    const available = await this.checkClassroomAvailability(
      data.classroomId,
      data.start.toString(),
      data.end.toString(),
    );
    if (available) {
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
  ): Promise<Session> {
    if (data.start && data.end) {
      const session = await this.getSessionBySessionId(id);
      const available = await this.checkClassroomAvailability(
        session.classroomId,
        data.start.toString(),
        data.end.toString(),
      );
      if (available) {
        return SessionDao.updateSession(id, data);
      }
      throw new Error(
        'Unable to update session because another session is already using the classroom.',
      );
    }
    return SessionDao.updateSession(id, data);
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
