import {
  getSessionById as apiGetSessionById,
  getAttendancesBySessionId as apiGetAttendanceBySession,
  createAttendance as apiCreateAttendance,
  revertAttendance as apiRevertAttendance,
} from '@acer-academy-learning/data-access';
import { useState, useEffect } from 'react';
import { useToast } from '@acer-academy-learning/common-ui';
import { SessionData } from 'libs/data-access/src/lib/types/session';
import {
  AttendanceData,
  AttendanceCreateData,
} from 'libs/data-access/src/lib/types/attendance';
import { useParams } from 'react-router-dom';
import { QrModal } from './GenerateQrCode';

export const MarkAttendance: React.FC = () => {
  const { displayToast, ToastType } = useToast();
  const { sessionId } = useParams();
  const [session, setSession] = useState<SessionData>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [attendances, setAttendances] = useState<AttendanceData[]>([]);
  const [generateQrCode, setGenerateQrCode] = useState(false);

  const getSession = async () => {
    try {
      const response = await apiGetSessionById(sessionId || '');
      const session: SessionData = response.data;
      setSession(session);
    } catch (err) {
      console.log(err);
    }
  };

  const getAttendances = async () => {
    try {
      const response = await apiGetAttendanceBySession(sessionId || '');
      const allAttendances: AttendanceData[] = response.data;
      setAttendances(allAttendances);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSession();
    getAttendances();
  }, [isEditing]);

  const markAttendance = async (studentId: string) => {
    try {
      setIsEditing(true);
      const createAttendance: AttendanceCreateData = {
        studentId,
        sessionId: sessionId || '',
      };
      await apiCreateAttendance(createAttendance);
      displayToast('Attendance marked!', ToastType.SUCCESS);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  const revertAttendance = async (attendanceId: string) => {
    try {
      setIsEditing(true);
      await apiRevertAttendance(attendanceId);
      displayToast('Attendance reverted!', ToastType.SUCCESS);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8 gap-10">
      <div className="flex min-h-full flex-col gap-7 align-middle ">
        <a
          className="hover:text-admin-primary-700 underline"
          href="scheduling/attendance"
        >{`< Back`}</a>
        <div className="flex justify-between px-5">
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <button
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-teacher-primary-700 border border-transparent rounded-md hover:bg-admin-primary-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-admin-primary-500"
            onClick={() => {
              setGenerateQrCode(true);
            }}
          >
            Generate QR Code
          </button>
        </div>
      </div>

      <div className="flex items-center">
        {(session && session.students && session?.students.length) || 0 > 0 ? (
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 max-w-xs"
                >
                  Student Name
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-gray-900 sm:pl-6 max-w-xs"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {session?.students.map((student) => (
                <tr key={student.id}>
                  <td className="whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-xs">
                    {`${student.firstName} ${student.lastName}`}
                  </td>
                  {attendances.filter(
                    (attendance) => attendance.student.id === student.id,
                  ).length > 0 ? (
                    attendances
                      .filter(
                        (attendance) => attendance.student.id === student.id,
                      )
                      .map((attendance) =>
                        attendance.hasAttended ? (
                          <td
                            key={attendance.id}
                            className="flex items-center justify-center px-20 py-2"
                          >
                            <button
                              onClick={() => revertAttendance(attendance.id)}
                              className="flex justify-center rounded-md bg-teacher-primary-900 px-10 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teacher-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teacher-secondary-600"
                            >
                              Revert
                            </button>
                          </td>
                        ) : (
                          <td
                            key={attendance.id}
                            className="flex items-center justify-center px-20 py-2"
                          >
                            <button
                              disabled={true}
                              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none bg-gray-300 text-gray-500 cursor-not-allowed"
                            >
                              Reverted
                            </button>
                          </td>
                        ),
                      )
                  ) : (
                    <td className="flex items-center justify-center px-20 py-2">
                      <button
                        onClick={() => markAttendance(student.id)}
                        className="inline-flex justify-center rounded-md bg-teacher-secondary-900 px-10 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teacher-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teacher-secondary-600"
                      >
                        Mark
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <span>No students in this session</span>
        )}
      </div>
      {generateQrCode && (
        <QrModal
          setIsModalOpen={setGenerateQrCode}
          sessionId={sessionId || ''}
        />
      )}
    </div>
  );
};
