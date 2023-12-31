import SessionDao from '../dao/SessionDao';
import { Session, Prisma, Student } from '@prisma/client';
import { ClassroomService } from './ClassroomService';

class SessionService {
  private classroomService = new ClassroomService();

  public async createSession(
    data: Prisma.SessionUncheckedCreateInput,
    studentIdArr: Array<string>,
  ): Promise<Session> {
    const available = await this.checkClassroomAvailability(
      data.classroomId,
      data.start.toString(),
      data.end.toString(),
    );
    const classroom = await this.classroomService.getClassroomById(
      data.classroomId,
    );

    if (!available) {
      if (studentIdArr.length > 0) {
        if (studentIdArr.length <= classroom.capacity) {
          const formattedData = {
            ...data,
            students: {
              connect: studentIdArr?.map((studentId: string) => ({
                id: studentId,
              })),
            },
          };
          return await SessionDao.createSession(formattedData);
        } else {
          throw new Error(
            'Unable to create because number of students is more than classroom capacity.',
          );
        }
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

  public async getSessionsInPastWeek(): Promise<Session[]> {
    return SessionDao.getSessionsInPastWeek();
  }

  public async getSessionsByStudentIdBeforeToday(
    studentId: string,
  ): Promise<Session[]> {
    return SessionDao.getSessionsByStudentIdBeforeToday(studentId);
  }

  public async getSessionsInPastWeekByTeacherId(
    teacherId: string,
  ): Promise<Session[]> {
    return SessionDao.getSessionsInPastWeekByTeacherId(teacherId);
  }

  public async getSessionsByClassId(classId: string): Promise<Session[]> {
    return SessionDao.getSessionsByClassId(classId);
  }

  public async updateSessionBase(
    id: string,
    data: Prisma.SessionUncheckedUpdateInput,
  ): Promise<Session> {
    return SessionDao.updateSession(id, data);
  }

  public async updateSession(
    id: string,
    data: Prisma.SessionUncheckedUpdateInput,
    addStudentIdArr: Array<string>,
    removeStudentIdArr: Array<string>,
  ): Promise<Session> {
    const session = await this.getSessionBySessionId(id);
    let formattedData = { ...data };
    if (addStudentIdArr.length > 0 || removeStudentIdArr.length > 0) {
      formattedData = {
        students: {
          connect: addStudentIdArr?.map((studentId: string) => ({
            id: studentId,
          })),
          disconnect: removeStudentIdArr?.map((studentId: string) => ({
            id: studentId,
          })),
        },
      };
      const available = await this.checkCapacityAvailability(
        id,
        session.classroomId,
        addStudentIdArr.length - removeStudentIdArr.length,
      );
      if (!available) {
        throw new Error(
          'Unable to update session because classroom has hit its maximum capacity.',
        );
      }
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
        return await this.updateSessionBase(id, formattedData);
      }
      throw new Error(
        'Unable to update session because another session is already using the classroom.',
      );
    }
    return this.updateSessionBase(id, formattedData);
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

    return this.updateSessionBase(sessionId, payload);
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

    return this.updateSessionBase(sessionId, payload);
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

  private async getStudentsInSession(sessionId: string): Promise<Student[]> {
    return SessionDao.getStudentsInSession(sessionId);
  }

  public async checkCapacityAvailability(
    sessionId: string,
    classroomId: string,
    adding: number,
  ) {
    const students = await this.getStudentsInSession(sessionId);
    const classroom = await this.classroomService.getClassroomById(classroomId);
    return classroom.capacity >= students.length + adding;
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
