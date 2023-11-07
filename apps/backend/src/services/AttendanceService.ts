import {
  Prisma,
  Attendance,
  TransactionType,
  Transaction,
} from '@prisma/client';
import AttendanceDao from '../dao/AttendanceDao';
import TransactionService from './TransactionService';
import { TermService } from './TermService';

const termService = new TermService();

class AttendanceService {
  public async createAttendance(
    attendanceData: Prisma.AttendanceUncheckedCreateInput,
  ): Promise<{ attendance: Attendance; transaction: Transaction }> {
    const currTerm = await termService.getCurrentTerms();
    const attendance = await AttendanceDao.createAttendance(attendanceData);
    const transaction = await TransactionService.createTransaction({
      termId: currTerm[0].id,
      creditsTransacted: 1,
      studentId: attendanceData.studentId,
      transactionType: TransactionType.DEDUCTED,
      attendanceId: attendance.id,
    });
    return { attendance: attendance, transaction: transaction };
  }

  public async revertAttendance(
    attendanceId,
  ): Promise<{ attendance: Attendance; transaction: Transaction }> {
    const attendance = await AttendanceDao.updateAttendance(attendanceId);
    const prevTransaction =
      await TransactionService.getTransactionsByAttendanceId(attendanceId);
    const transaction = await TransactionService.createTransaction({
      termId: prevTransaction[0].termId,
      creditsTransacted: 1,
      studentId: attendance.studentId,
      transactionType: TransactionType.CREDIT_REFUND,
      attendanceId: attendance.id,
      referenceId: prevTransaction[0].id,
    });
    return { attendance: attendance, transaction: transaction };
  }

  public async getAllAttendances(): Promise<Attendance[]> {
    return AttendanceDao.getAllAttendances();
  }

  public async getAttendancesBySessionId(
    sessionId: string,
  ): Promise<Attendance[]> {
    return AttendanceDao.getAttendancesBySessionId(sessionId);
  }

  public async getAttendanceById(attendanceId: string): Promise<Attendance> {
    return AttendanceDao.getAttendanceById(attendanceId);
  }

  public async getAttendanceBySessionAndStudentId(
    sessionId: string,
    studentId: string,
  ) {
    return AttendanceDao.getAttendanceBySessionAndStudentId(
      sessionId,
      studentId,
    );
  }
}

export default new AttendanceService();
