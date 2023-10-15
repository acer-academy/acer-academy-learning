import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import './index.css';
import { EventItem } from './CustomCalendar.types';
import './index.css';
import SessionEvent from './SessionEvent';
import { getAllSessions } from '@acer-academy-learning/data-access';
import { SessionData } from 'libs/data-access/src/lib/types/session';
import { useEffect, useState } from 'react';

const localizer = momentLocalizer(moment);

const initProps = {
  localizer: localizer,
  defaultView: Views.MONTH,
  min: moment('2023-10-13T08:00:00').toDate(),
  step: 15,
  timeslots: 4,
};

const DndCalendar = withDragAndDrop<EventItem>(BigCalendar);
interface CalendarProps {
  onShowSessionView: (session: SessionData) => void;
}

export const TestCalendar = ({ onShowSessionView }: CalendarProps) => {
  const [sessions, setSessions] = useState<SessionData[]>([]);

  const components = {
    event: ({ event }: { event: any }) => {
      const data = event?.data;
      if (data?.session)
        return (
          <SessionEvent session={data?.session} onDoubleClick={() => {}} />
        );

      return null;
    },
  };

  const fetchSessions = async () => {
    try {
      const response = await getAllSessions();
      const allSessions: SessionData[] = response.data;
      console.log(allSessions);
      setSessions(allSessions);
    } catch (error) {
      console.error('Error retrieving transactions:', error);
    }
  };

  // Use Effect Hook
  useEffect(() => {
    fetchSessions();
  }, []);

  const sessionsData = sessions?.map((session) => ({
    start: new Date(session.start),
    end: new Date(session.end),
    data: { session },
  }));

  return (
    <DndCalendar
      onSelectSlot={({ start, end }) => {
        onShowSessionView({ start, end });
      }}
      onDoubleClickEvent={(event) => {
        const session = event?.data?.session;
        session && onShowSessionView(session);
      }}
      events={sessionsData}
      style={{ width: '100%' }}
      components={components}
      selectable
      {...initProps}
    />
  );
};
