import ClassDao from '../dao/ClassDao';
import SessionService from './SessionService';
import { Class, Session, Prisma, ClassFrequencyEnum } from '@prisma/client';

class ClassService {
  public async createClass(
    data: Prisma.ClassUncheckedCreateInput,
  ): Promise<Class> {
    return ClassDao.createClass(data);
  }

  public async createRecurringClass(
    classData: Prisma.ClassUncheckedCreateInput,
    sessionData: Prisma.SessionUncheckedCreateInput,
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
    let sessions: Session[] = [];

    try {
      while (currDate <= endDate) {
        const session = await SessionService.createSession({
          ...sessionData,
          start: currDate,
          end: eventEndDate,
          classId: newClass.id,
        });
        sessions.push(session);
        switch (classData.frequency) {
          case ClassFrequencyEnum.DAILY: {
            currDate.setDate(currDate.getDate() + 1);
            eventEndDate.setDate(eventEndDate.getDate() + 1);
            break;
          }
          case ClassFrequencyEnum.WEEKLY: {
            currDate.setDate(currDate.getDate() + 7);
            eventEndDate.setDate(eventEndDate.getDate() + 7);
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
          }
        }
      }
      return sessions;
    } catch (error) {
      this.deleteClass(newClass.id);
      for (let session of sessions) {
        SessionService.deleteSession(session.id);
      }
      throw new Error(error.message);
    }
  }

  //   private async findNextDay(day: string, refDate: Date) {
  //     const dayOfWeek = [
  //       'MONDAY',
  //       'TUESDAY',
  //       'WEDNESDAY',
  //       'THURSDAY',
  //       'FRIDAY',
  //       'SATURDAY',
  //       'SUNDAY',
  //     ].indexOf(day);
  //     refDate.setDate(
  //       refDate.getDate() + ((dayOfWeek + 7 - refDate.getDay()) % 7),
  //     );
  //     return refDate;
  //   }

  public async updateRecurringClass(
    sessionId: string,
    classData: Prisma.ClassUncheckedUpdateInput,
    sessionData: Prisma.SessionUncheckedUpdateInput,
  ): Promise<Session[]> {
    const sessionBeforeUpdate = await SessionService.getSessionBySessionId(
      sessionId,
    );
    const classId = sessionBeforeUpdate.classId;
    const classBeforeUpdate = await this.getClassById(classId);
    const newEndDate =
      (sessionData.end as string) || sessionBeforeUpdate.end.toString();
    const diffEndDate =
      new Date(newEndDate).getTime() - sessionBeforeUpdate.end.getTime();
    const newStartTime =
      (sessionData.start as string) || sessionBeforeUpdate.start.toString();
    const diffStartDate =
      new Date(newStartTime).getTime() - sessionBeforeUpdate.start.getTime();
    const sessions: Session[] = await SessionService.getFutureSessionsOfClass(
      classId,
    );
    const updatedSessions = [];

    console.log('diffEndDate', diffEndDate);
    console.log('diffStartDate', diffStartDate);

    if (
      !classData.frequency ||
      classData.frequency === classBeforeUpdate.frequency
    ) {
      for (let session of sessions) {
        const updatedSession = await SessionService.updateSession(session.id, {
          ...sessionData,
          start: new Date(session.start.getTime() + diffStartDate),
          end: new Date(session.end.getTime() + diffEndDate),
        });
        console.log('updated', updatedSession);
        updatedSessions.push(updatedSession);
      }
    }
    return updatedSessions;
  }

  public async deleteRecurringClass(id: string): Promise<Class> {
    const classData = await SessionService.getFutureSessionsOfClass(id);
    for (let i of classData) {
      SessionService.deleteSession(i.id);
    }
    const checkSessionsExist = await SessionService.getSessionsByClassId(id);
    if (checkSessionsExist.length === 0) {
      return this.deleteClass(id);
    }
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
