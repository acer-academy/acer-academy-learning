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
import { useEffect, useRef, useState } from 'react';
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

// const getComponents = (currentView: string) => ({
//   event: ({ event }: { event: any }) => {
//     console.log(currentView);

//     const data = event?.data;
//     if (currentView === 'month') {
//       return <p>hello</p>;
//     }

//     return <SessionEvent session={data?.session} onDoubleClick={() => {}} />;
//   },
// });

export const TestCalendar = ({
  onShowSessionView,
  sessionsData,
}: CalendarProps) => {
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());

  const viewRef = useRef(view); // create a ref for the view

  // update the ref every time the view changes
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const components = {
    event: ({ event }: { event: any }) => {
      console.log(viewRef.current); // log the current value from the ref

      const data = event?.data;
      if (viewRef.current === 'month') {
        // use the ref value here
        return <p>hello</p>;
      }

      return <SessionEvent session={data?.session} onDoubleClick={() => {}} />;
    },
  };

  return (
    <>
      View: {view}
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
        // onView={setView} // Corrected this line
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
            agenda: true,
            year: YearView,
          } as any
        }
        messages={{ year: 'Year' } as any}
        {...initProps}
      />
    </>
  );
};
