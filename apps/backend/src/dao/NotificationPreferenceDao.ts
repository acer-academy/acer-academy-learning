import { Prisma, PrismaClient } from '@prisma/client';

class NotificationPreferenceDao {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createNotificationPreference(
    input: Prisma.NotificationPreferenceCreateInput,
  ) {
    return this.prisma.notificationPreference.create({
      data: {
        ...input,
      },
    });
  }

  public async updateNotificationPreference(
    id: string,
    input: Prisma.NotificationPreferenceUpdateInput,
  ) {
    return this.prisma.notificationPreference.update({
      where: { id },
      data: {
        ...input,
      },
    });
  }
}

export default new NotificationPreferenceDao();
