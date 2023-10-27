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
import { useCallback, useEffect, useRef, useState } from 'react';
import YearView from './YearView/YearView';
import { EventModal } from './EventModal';
import { useAuth } from '@acer-academy-learning/common-ui';
import { Teacher, TeacherData } from 'libs/data-access/src/lib/types/teacher';

const localizer = momentLocalizer(moment);

const initProps = {
  localizer: localizer,
  defaultView: Views.MONTH,
  // min: moment('2023-10-13T08:00:00').toDate(),
  step: 15,
  timeslots: 4,
};

const DndCalendar = withDragAndDrop<EventItem>(BigCalendar);
interface CalendarProps {
  onShowSessionView: (session: SessionData) => void;
  onShowSessionReadView: (readSession: SessionData) => void;
  sessionsData: {
    start: Date;
    end: Date;
    data: { session: SessionData };
  }[];
}

export const SchedulingCalendar = ({
  onShowSessionView,
  onShowSessionReadView,
  sessionsData,
}: CalendarProps) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());

  const viewRef = useRef(view); // create a ref for the view

  const { user } = useAuth<Teacher>();

  // update the ref every time the view changes
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  // const onSelectEvent = useCallback((calEvent) => {
  //   setSelectedEvent(calEvent);
  //   setIsModalOpen(true);
  // }, []);

  const components = {
    event: ({ event }: { event: any }) => {

      const data = event?.data;
      if (viewRef.current === 'month') {
        // use the ref value here
        return (
          <p className="text-xs">
            {data?.session.teacher.firstName} {data?.session.teacher.lastName}
          </p>
        );
      }

      return <SessionEvent session={data?.session} onDoubleClick={() => {}} />;
    },
  };

  return (
    <>
      {/* View: {view} */}
      {/* <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      /> */}
      <DndCalendar
        onSelectSlot={({ start, end }) => {
          onShowSessionView({ start, end });
        }}
        // onSelectEvent={onSelectEvent}
        onDoubleClickEvent={(event) => {
          const session = event?.data?.session;
          if(session && session.teacherId !== user?.id) {
            console.log("here")
            console.log(session)
            onShowSessionReadView(session);
          } else {
            session && onShowSessionView(session);
          }
         
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
