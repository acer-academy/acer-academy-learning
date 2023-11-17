import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  getSessionById as apiGetSessionById,
  createAttendance as apiCreateAttendance,
  getAttendanceBySessionAndStudentId as apiGetMarkedAttendance,
} from '@acer-academy-learning/data-access';
import { SessionData } from 'libs/data-access/src/lib/types/session';
import { useToast } from '@acer-academy-learning/common-ui';
import { useAuth } from '@acer-academy-learning/common-ui';
import { Student } from 'libs/data-access/src/lib/types/student';
import { Divider, FullscreenSpinner } from '@acer-academy-learning/common-ui';
import {
  AttendanceCreateData,
  AttendanceData,
} from 'libs/data-access/src/lib/types/attendance';

export const Attendance: React.FC = () => {
  const { sessionId } = useParams();
  const { user } = useAuth<Student>();
  const { displayToast, ToastType } = useToast();
  const [session, setSession] = useState<SessionData>();
  const [isEditing, setIsEditing] = useState(false);
  const [attendance, setAttendance] = useState(false);

  const getSession = async () => {
    try {
      const response = await apiGetSessionById(sessionId || '');
      const session: SessionData = response.data;
      setSession(session);
    } catch (err) {
      displayToast('Unable to retrieve session.', ToastType.ERROR);
      console.log(err);
    }
  };

  const getAttendance = async () => {
    try {
      const response = await apiGetMarkedAttendance(
        sessionId || '',
        user?.id || '',
      );
      if (response.data.length === 0) {
        setAttendance(false);
      } else {
        setAttendance(true);
      }
    } catch (err: any) {
      displayToast(`${err.response.data.error}`, ToastType.ERROR);
      console.log(err);
    }
  };

  const markAttendance = async () => {
    try {
      setIsEditing(true);
      const createAttendance: AttendanceCreateData = {
        studentId: user?.id || '',
        sessionId: sessionId || '',
      };
      await apiCreateAttendance(createAttendance);
      setIsEditing(false);
      displayToast('Attendance marked!', ToastType.SUCCESS);
    } catch (err: any) {
      displayToast(`${err.response.data.error}`, ToastType.ERROR);
      console.log(err);
    }
  };

  useEffect(() => {
    getSession();
    getAttendance();
  }, [isEditing]);

  return (
    (session && (
      <div className="space-y-4 flex flex-col h-full">
        <h1 className="text-3xl font-bold tracking-tight ">Attendance</h1>
        <Divider lineClassName="border-gray-900" />
        <h3 className="text-3xl font-bold tracking-tight ">Session Details</h3>
        <p className="font-bold">
          Start time:{' '}
          {`${new Date(session.start).toDateString()} ${new Date(
            session.start,
          ).toLocaleTimeString()}`}
        </p>
        <p className="font-bold">
          End time:{' '}
          {`${new Date(session.end).toDateString()} ${new Date(
            session.end,
          ).toLocaleTimeString()}`}
        </p>
        {session.students?.some((student) => student.id === user?.id) ? (
          attendance ? (
            <button
              disabled={true}
              className="inline-flex w-80 justify-center px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              Attendance marked
            </button>
          ) : (
            <button
              onClick={() => markAttendance()}
              className="flex w-80 items-center justify-center rounded-md bg-student-primary-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-student-secondary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-student-secondary-600"
            >
              I'm here
            </button>
          )
        ) : (
          <p>
            Seems like you have not booked the session. Please book the session
            before marking your attendance.
          </p>
        )}
      </div>
    )) || <FullscreenSpinner />
  );
};
