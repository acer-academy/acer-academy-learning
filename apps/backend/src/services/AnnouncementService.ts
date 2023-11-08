import { AnnouncementDao } from '../dao/AnnouncementDao';
import { Announcement, Prisma } from '@prisma/client';
import { StudentDao } from '../dao/StudentDao';
import { Request } from 'express';

export class AnnouncementService {
  constructor(
    private announcementDao: AnnouncementDao = new AnnouncementDao(),
    private studentDao: StudentDao = new StudentDao(),
  ) {}

  public async createAnnouncement(req: Request): Promise<Announcement> {
    const announcementData = req.body;
    const formattedAnnouncementData: Prisma.AnnouncementCreateInput = {
      title: announcementData.title,
      message: announcementData.message,
      createdAt: announcementData.createdAt,
      targetSubjects: announcementData.targetSubjects,
      targetLevels: announcementData.targetLevels,
      teacher: {
        connect: {
          id: announcementData.teacherId,
        },
      },
      targetCentres: {
        connect: announcementData.targetCentres.map((centreId: string) => ({
          id: centreId,
        })),
      },
    };
    return this.announcementDao.createAnnouncement(formattedAnnouncementData);
  }

  public async getAllAnnouncements(): Promise<Announcement[]> {
    return this.announcementDao.getAllAnnouncements();
  }

  public async getAnnouncementsByTeacherId(
    teacherId: string,
  ): Promise<Announcement[]> {
    return this.announcementDao.getAnnouncementsByTeacherId(teacherId);
  }

  public async getAnnouncementsByStudentId(
    studentId: string,
  ): Promise<Announcement[]> {
    // Get student centre, level, and subjects
    return this.studentDao.getStudentById(studentId).then((student) =>
      // Get announcements by centre
      this.announcementDao
        .getAnnouncementsByCentreId(student.centreId)
        .then((announcements) =>
          announcements.filter(
            (announcement) =>
              // Filter announcements by level
              announcement.targetLevels.includes(student.level) &&
              // Filter announcements by subjects - student and announcement have at least one same subject
              announcement.targetSubjects.some((subject) =>
                student.subjects.includes(subject),
              ),
          ),
        ),
    );
  }

  public async getAnnouncementById(
    announcementId: string,
  ): Promise<Announcement> {
    return this.announcementDao.getAnnouncementById(announcementId);
  }

  public async updateAnnouncement(
    announcementId: string,
    req: Request,
  ): Promise<Announcement> {
    const announcementData = req.body;
    const formattedAnnouncementData: Prisma.AnnouncementUpdateInput = {
      title: announcementData.title,
      message: announcementData.message,
      createdAt: announcementData.createdAt,
      targetSubjects: announcementData.targetSubjects,
      targetLevels: announcementData.targetLevels,
      teacher: {
        connect: {
          id: announcementData.teacherId,
        },
      },
      targetCentres: {
        connect: announcementData.targetCentres.map((centreId: string) => ({
          id: centreId,
        })),
      },
    };
    return this.announcementDao.updateAnnouncement(
      announcementId,
      formattedAnnouncementData,
    );
  }

  public async deleteAnnouncement(
    announcementId: string,
  ): Promise<Announcement> {
    return this.announcementDao.deleteAnnouncement(announcementId);
  }
}
