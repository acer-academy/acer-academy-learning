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
import { SessionData } from 'libs/data-access/src/lib/types/session';
import { useState } from 'react';
import YearView from './YearView/YearView';

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
  sessionsData: {
    start: Date;
    end: Date;
    data: { session: SessionData };
  }[];
}

export const TestCalendar = ({
  onShowSessionView,
  sessionsData,
}: CalendarProps) => {
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());

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
      style={{
        width: '100%',
        height: '100%',
        background: 'white',
        padding: 20,
      }}
      components={components}
      selectable
      // defaultView={Views.WEEK}
      view={view}
      date={date}
      onView={(view) => setView(view)}
      onNavigate={(date) => setDate(date)}
      formats={{
        dayHeaderFormat: (date) => moment(date).format('Do MMMM YYYY'),
      }}
      views={
        {
          month: true,
          day: true,
          week: true,
          year: YearView,
        } as any
      }
      messages={{ year: 'Year' } as any}
      {...initProps}
    />
  );
};
