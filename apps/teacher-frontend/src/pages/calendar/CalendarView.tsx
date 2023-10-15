import { useEffect, useState } from 'react';
import { TestCalendar } from './TestCalendar';
import { SessionData } from 'libs/data-access/src/lib/types/session';
import EventForm from './EventForm';
import { getAllSessions } from '@acer-academy-learning/data-access';

export default function CalendarView() {
  const [session, setSession] = useState<SessionData>();
  const [sessions, setSessions] = useState<SessionData[]>([]); // Moved state here

  const fetchSessions = async () => {
    try {
      const response = await getAllSessions();
      const allSessions: SessionData[] = response.data;
      setSessions(allSessions);
    } catch (error) {
      console.error('Error retrieving transactions:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const sessionsData = sessions?.map((session) => ({
    start: new Date(session.start),
    end: new Date(session.end),
    data: { session },
  }));

  return (
    <div className="flex space-x-10 m-4 h-full">
      {/* Calendar */}
      <div className="flex-grow flex-basis-1/2 overflow-auto">
        <TestCalendar
          onShowSessionView={(session) => setSession(session)}
          sessionsData={sessionsData}
        />
      </div>

      {/* EventForm */}
      <div className="flex-grow flex-basis-1/2">
        {session && (
          <EventForm
            session={session}
            fetchSessions={fetchSessions}
            onClose={() => setSession(null)} // Close the modal by setting session to null
          />
        )}
      </div>
    </div>
  );
}
