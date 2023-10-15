import { useState } from 'react';
import { TestCalendar } from './TestCalendar';
import { SessionData } from 'libs/data-access/src/lib/types/session';
import EventForm from './EventForm';

export default function CalendarView() {
  const [session, setSession] = useState<SessionData>();

  return (
    <div className="flex space-x-10 m-4 h-full">
      {/* Calendar */}
      <div className="flex-grow flex-basis-1/2 overflow-auto">
        <TestCalendar onShowSessionView={(session) => setSession(session)} />
      </div>

      {/* EventForm */}
      <div className="flex-grow flex-basis-1/2">
        {session && <EventForm session={session} />}
      </div>
    </div>
  );
}
