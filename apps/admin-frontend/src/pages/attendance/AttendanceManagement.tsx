import { SessionData } from 'libs/data-access/src/lib/types/session';
import { useEffect, useState } from 'react';
import { useToast } from '@acer-academy-learning/common-ui';
import { getSessionsInPastWeek as apiSessionsPastWeek } from '@acer-academy-learning/data-access';

export const AttendanceManagement: React.FC = () => {
  const [sessions, setSessions] = useState<SessionData[]>([]);

  const { displayToast, ToastType } = useToast();

  const getSessionsInPastWeek = async () => {
    try {
      const response = await apiSessionsPastWeek();
      const allSessions: SessionData[] = response.data;
      setSessions(allSessions);
    } catch (error) {
      displayToast(
        'Sessions could not be retrieved from the server.',
        ToastType.ERROR,
      );
      console.log(error);
    }
  };

  useEffect(() => {
    getSessionsInPastWeek();
  }, []);

  return (
    <div className="h-full ">
      <div className="flex min-h-full flex-col gap-7 align-middle py-12 px-12">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold tracking-tight">Sessions</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
          {sessions?.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session.id}
                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-admin-primary-700 focus-within:ring-offset-2 hover:border-gray-400"
              >
                <div className="min-w-0 flex-1">
                  <a
                    href={`/scheduling-resources/attendance/mark/${session.id}`}
                    className="focus:outline-none"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">
                      {`Start: ${new Date(
                        session.start,
                      ).toDateString()} ${new Date(
                        session.start,
                      ).toLocaleTimeString()}`}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {`End: ${new Date(session.end).toDateString()} ${new Date(
                        session.end,
                      ).toLocaleTimeString()}`}
                    </p>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <span className="text-sm italic text-gray-500">
              No sessions in the past week.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
