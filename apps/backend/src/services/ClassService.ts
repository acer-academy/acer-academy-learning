import ClassDao from '../dao/ClassDao';
import SessionService from './SessionService';
import {
  Class,
  Session,
  Prisma,
  ClassFrequencyEnum,
  SubjectEnum,
  LevelEnum,
} from '@prisma/client';

class ClassService {
  constructor() {}
  public async createClass(
    data: Prisma.ClassUncheckedCreateInput,
  ): Promise<Class> {
    return ClassDao.createClass(data);
  }

  public async createRecurringClass(
    classData: Prisma.ClassUncheckedCreateInput,
    sessionData: Prisma.SessionUncheckedCreateInput,
    studentIdArr: Array<String>,
  ): Promise<Session[]> {
    let currDate = new Date(sessionData.start);
    let eventEndDate = new Date(sessionData.end);
    const endDate = new Date(
      new Date(classData.endRecurringDate).setHours(23, 59, 59),
    );
    const newClass = await this.createClass({
      ...classData,
      endRecurringDate: endDate,
    });
    const sessions: Session[] = [];

    try {
      let payload = {};
      if (studentIdArr.length > 0) {
        payload = {
          students: {
            connect: studentIdArr?.map((studentId: string) => ({
              id: studentId,
            })),
          },
        };
      }
      while (currDate <= endDate) {
        const session = await SessionService.createSession(
          {
            ...sessionData,
            ...payload,
            start: currDate,
            end: eventEndDate,
            classId: newClass.id,
          },
          [],
        );
        sessions.push(session);
        const newDates = this.getNextDates(
          classData.frequency,
          currDate,
          eventEndDate,
        );
        currDate = newDates[0];
        eventEndDate = newDates[1];
      }

      return sessions;
    } catch (error) {
      this.deleteClass(newClass.id);
      for (const session of sessions) {
        SessionService.deleteSession(session.id);
      }
      throw new Error(error.message);
    }
  }

  public async updateRecurringClass(
    sessionId: string,
    classId: string,
    classData: Prisma.ClassUncheckedUpdateInput,
    sessionData: Prisma.SessionUncheckedUpdateInput,
    addStudentIdArr: Array<string>,
    removeStudentIdArr: Array<string>,
  ): Promise<Session[]> {
    const sessions: Session[] = await SessionService.getFutureSessionsOfClass(
      classId,
    );
    const sessionBeforeUpdate = await SessionService.getSessionBySessionId(
      sessionId,
    );
    const classBeforeUpdate = await this.getClassById(classId);

    const data = {
      levels: sessionData.levels
        ? (sessionData.levels as LevelEnum[])
        : sessionBeforeUpdate.levels,
      subjects: sessionData.subjects
        ? (sessionData.subjects as SubjectEnum[])
        : sessionBeforeUpdate.subjects,
      teacherId: sessionData.teacherId
        ? (sessionData.teacherId as string)
        : sessionBeforeUpdate.teacherId,
      classroomId: sessionData.classroomId
        ? (sessionData.classroomId as string)
        : sessionBeforeUpdate.classroomId,
      classId: classBeforeUpdate.id,
    };

    let eventEndDate = sessionData.end
      ? new Date(sessionData.end as string)
      : sessionBeforeUpdate.end;
    let currDate = sessionData.start
      ? new Date(sessionData.start as string)
      : sessionBeforeUpdate.start;
    const endRecurringDate: Date = classData.endRecurringDate
      ? new Date(
          new Date(classData.endRecurringDate as string).setHours(23, 59, 59),
        )
      : classBeforeUpdate.endRecurringDate;
    const newFrequncy = classData.frequency
      ? (classData.frequency as string)
      : classBeforeUpdate.frequency;

    await this.updateClass(classId, {
      ...classData,
      endRecurringDate: endRecurringDate,
    });

    let updatedSessions: Session[] = [];
    let endIndex = -1;
    let start = false;

    try {
      let payload = {};
      if (addStudentIdArr.length > 0 || removeStudentIdArr.length > 0) {
        payload = {
          ...data,
          students: {
            connect: addStudentIdArr?.map((studentId: string) => ({
              id: studentId,
            })),
            disconnect: removeStudentIdArr?.map((studentId: string) => ({
              id: studentId,
            })),
          },
        };
      }
      let totalBooking = addStudentIdArr.length - removeStudentIdArr.length;
      for (const index in sessions) {
        if (sessions[index].id === sessionId) {
          start = true;
        }
        if (start) {
          if (sessions[index].start < currDate) {
            await SessionService.deleteSession(sessions[index].id);
          } else {
            const check = await SessionService.checkCapacityAvailability(
              sessions[index].id,
              sessions[index].classroomId,
              totalBooking,
            );
            if (!check) {
              throw new Error(
                'Unable to update sessions because classroom has hit its maximum capacity.',
              );
            }
            const updatedSession = await SessionService.updateSession(
              sessions[index].id,
              {
                ...data,
                ...payload,
                start: currDate,
                end: eventEndDate,
              },
              [],
              [],
            );
            updatedSessions.push(updatedSession);
            if (updatedSession.start >= endRecurringDate) {
              endIndex = parseInt(index);
              break;
            }
            const newDates = this.getNextDates(
              newFrequncy,
              currDate,
              eventEndDate,
            );
            currDate = newDates[0];
            eventEndDate = newDates[1];
          }
        }
      }

      //Check: Not enough existing sessions - either frequency increased or endRecurringDate increased
      while (currDate <= endRecurringDate) {
        const session = await SessionService.createSession(
          {
            ...data,
            ...payload,
            start: currDate,
            end: eventEndDate,
          },
          [],
        );
        updatedSessions.push(session);
        const newDates = this.getNextDates(newFrequncy, currDate, eventEndDate);
        currDate = newDates[0];
        eventEndDate = newDates[1];
      }

      //Check: Too many existing sessions - either frequency decreased or endRecurringDate brought forward
      if (endIndex > -1) {
        for (let i = endIndex; i < sessions.length; i++) {
          await SessionService.deleteSession(sessions[i].id);
        }
        updatedSessions = updatedSessions.splice(0, endIndex);
      }

      return updatedSessions;
    } catch (error) {
      await this.updateClass(classId, {
        endRecurringDate: classBeforeUpdate.endRecurringDate,
        frequency: classBeforeUpdate.frequency,
      });
      const updatedList = await SessionService.getFutureSessionsOfClass(
        classId,
      );
      for (const index in sessions) {
        const oldData = {
          levels: sessions[index].levels,
          subjects: sessions[index].subjects,
          teacherId: sessions[index].teacherId,
          classroomId: sessions[index].classroomId,
          classId: classId,
          start: sessions[index].start,
          end: sessions[index].end,
        };
        if (updatedList[index] && updatedList[index] !== sessions[index]) {
          await SessionService.updateSession(
            updatedList[index].id,
            oldData,
            [],
            [],
          );
        } else if (!updatedList[index]) {
          await SessionService.createSession(oldData, []);
        }
      }
      for (let i = sessions.length - 1; i < updatedList.length; i++) {
        await SessionService.deleteSession(updatedList[i].id);
      }
      throw new Error(error.message);
    }
  }

  private getNextDates(
    type: string,
    currDate: Date,
    eventEndDate: Date,
  ): Array<Date> {
    switch (type) {
      case ClassFrequencyEnum.DAILY: {
        currDate.setDate(currDate.getDate() + 1);
        eventEndDate.setDate(eventEndDate.getDate() + 1);
        break;
      }
      case ClassFrequencyEnum.WEEKLY: {
        currDate.setDate(currDate.getDate() + 7);
        eventEndDate.setDate(eventEndDate.getDate() + 7);
        break;
      }
      case ClassFrequencyEnum.MONTHLY: {
        if (currDate.getMonth() === 11) {
          currDate.setMonth(0);
          currDate.setFullYear(currDate.getFullYear() + 1);
          eventEndDate.setMonth(0);
          eventEndDate.setFullYear(eventEndDate.getFullYear() + 1);
        } else if (currDate.getMonth() === 0) {
          const lastDayOfFeb = new Date(currDate.getFullYear(), 2, 0);
          if (
            currDate.toDateString().substring(7, 10) <=
            lastDayOfFeb.toDateString().substring(7, 10)
          ) {
            currDate.setMonth(currDate.getMonth() + 1);
            eventEndDate.setMonth(eventEndDate.getMonth() + 1);
          } else {
            currDate.setMonth(currDate.getMonth() + 2);
            eventEndDate.setMonth(eventEndDate.getMonth() + 2);
          }
        } else {
          currDate.setMonth(currDate.getMonth() + 1);
          eventEndDate.setMonth(eventEndDate.getMonth() + 1);
        }
        break;
      }
    }
    return [currDate, eventEndDate];
  }

  public async deleteRecurringClass(id: string): Promise<Class> {
    const classData = await SessionService.getFutureSessionsOfClass(id);
    for (const i of classData) {
      await SessionService.deleteSession(i.id);
    }
    const checkSessionsExist = await SessionService.getSessionsByClassId(id);
    if (checkSessionsExist.length === 0) {
      return await this.deleteClass(id);
    }
  }

  public async bookRecurringSession(
    studentId: string,
    sessionId: string,
  ): Promise<Session[]> {
    const currSession = await SessionService.getSessionBySessionId(sessionId);
    const sessions = await SessionService.getSessionsByClassId(
      currSession.classId,
    );
    let start = false;
    const bookedSessions = [];
    for (const session of sessions) {
      if (session.id === sessionId) {
        start = true;
      }
      if (start) {
        const booked = await SessionService.bookSession(studentId, session.id);
        bookedSessions.push(booked);
      }
    }
    return bookedSessions;
  }

  public async cancelRecurringBookedSession(
    studentId: string,
    sessionId: string,
  ): Promise<Session[]> {
    const currSession = await SessionService.getSessionBySessionId(sessionId);
    const sessions = await SessionService.getSessionsByClassId(
      currSession.classId,
    );
    let start = false;
    const cancelledSessions = [];
    for (const session of sessions) {
      if (session.id === sessionId) {
        start = true;
      }
      if (start) {
        const cancelled = await SessionService.cancelBookedSession(
          studentId,
          session.id,
        );
        cancelledSessions.push(cancelled);
      }
    }
    return cancelledSessions;
  }

  public async updateClass(
    id: string,
    data: Prisma.ClassUncheckedUpdateInput,
  ): Promise<Class> {
    return ClassDao.updateClass(id, data);
  }

  public async deleteClass(id: string): Promise<Class> {
    return ClassDao.deleteClass(id);
  }

  public async getClassById(id: string): Promise<Class> {
    return ClassDao.getClassById(id);
  }

  public async getAllClasses(): Promise<Class[]> {
    return ClassDao.getAllClasses();
  }
}

export default new ClassService();
