import { Prisma, PrismaClient, Announcement } from '@prisma/client';

export class AnnouncementDao {
  constructor(private prismaClient: PrismaClient = new PrismaClient()) {}

  public async createAnnouncement(
    announcementData: Prisma.AnnouncementCreateInput,
  ): Promise<Announcement> {
    return this.prismaClient.announcement.create({
      data: announcementData,
    });
  }

  public async getAllAnnouncements(): Promise<Announcement[]> {
    return this.prismaClient.announcement.findMany({
      include: {
        teacher: true,
        targetCentres: true,
      },
    });
  }

  public async getAnnouncementsByTeacherId(
    teacherId: string,
  ): Promise<Announcement[]> {
    return this.prismaClient.announcement.findMany({
      where: { teacherId: teacherId },
      include: {
        teacher: true,
        targetCentres: true,
      },
    });
  }

  public async getAnnouncementsByCentreId(
    centreId: string,
  ): Promise<Announcement[]> {
    return this.prismaClient.announcement.findMany({
      where: { targetCentres: { some: { id: centreId } } },
      include: {
        teacher: true,
        targetCentres: true,
      },
    });
  }

  public async getAnnouncementById(
    announcementId: string,
  ): Promise<Announcement | null> {
    return this.prismaClient.announcement.findUnique({
      where: { id: announcementId },
      include: {
        teacher: true,
        targetCentres: true,
      },
    });
  }

  public async updateAnnouncement(
    announcementId: string,
    announcementData: Prisma.AnnouncementUpdateInput,
  ): Promise<Announcement | null> {
    return this.prismaClient.announcement.update({
      where: { id: announcementId },
      data: announcementData,
    });
  }

  public async deleteAnnouncement(
    announcementId: string,
  ): Promise<Announcement | null> {
    return this.prismaClient.announcement.delete({
      where: { id: announcementId },
    });
  }
}
