import { NotificationPreference, Prisma, Student } from '@prisma/client';
import NotificationPreferenceDao from '../dao/NotificationPreferenceDao';

class NotificationPreferenceService {
  public async createDefault(
    student: Student,
  ): Promise<NotificationPreference> {
    const input: Prisma.NotificationPreferenceCreateInput = {
      isUnsubscribed: false,
      subjectsPref: student.subjects,
      levelsPref: [student.level],
      teacherPref: [],
      centrePref: [student.centreId],
      student: {
        connect: {
          id: student.id,
        },
      },
    };

    return NotificationPreferenceDao.createNotificationPreference(input);
  }

  public async updateNotificationPreference(
    id: string,
    input: Prisma.NotificationPreferenceUpdateInput,
  ) {
    return NotificationPreferenceDao.updateNotificationPreference(id, input);
  }
}

export default new NotificationPreferenceService();
