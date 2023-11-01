import { Attendance, Prisma, PrismaClient } from '@prisma/client';

class AttendanceDao {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createAttendance(
    data: Prisma.AttendanceUncheckedCreateInput,
  ): Promise<Attendance> {
    return this.prisma.attendance.create({ data });
  }

  public async getAllAttendances(): Promise<Attendance[]> {
    return this.prisma.attendance.findMany({
      include: {
        student: true,
        session: true,
      },
    });
  }

  public async getAttendancesBySessionId(sessionId): Promise<Attendance[]> {
    return this.prisma.attendance.findMany({
      where: { sessionId },
      include: {
        student: true,
      },
    });
  }

  public async getAttendanceById(id: string): Promise<Attendance> {
    return this.prisma.attendance.findUnique({
      where: {
        id,
      },
      include: {
        student: true,
        session: true,
      },
    });
  }

  public async updateAttendance(id: string): Promise<Attendance> {
    return this.prisma.attendance.update({
      where: {
        id,
      },
      data: { hasAttended: false },
    });
  }
}

export default new AttendanceDao();
