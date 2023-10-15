import moment from 'moment';
import Calendar from './Calendar';
import './index.css';
import { useState, useCallback } from 'react';

import withDragAndDrop, {
  withDragAndDropProps,
} from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { CalendarProps } from 'react-big-calendar';
import { EventItem } from './CustomCalendar.types';
import SessionEvent from './SessionEvent';
type CustomCalendarProps = Omit<DnDType, 'components' | 'localizer'>;

const DnDCalendar = withDragAndDrop(Calendar);
type DnDType = CalendarProps & withDragAndDropProps;

const EVENTS: EventItem[] = [
  {
    start: moment('2023-10-13T10:00:00').toDate(),
    end: moment('2023-10-13T11:00:00').toDate(),
    data: {
      session: {
        id: 1,
        status: 'P',
        location: 'New York',
        resource: 'Dr Alex',
        address: 'Building 5\nStreet 44\nNear Express Highway\nNew York',
      },
    },
    // isDraggable: true,
  },
  {
    start: moment('2023-10-13T10:00:00').toDate(),
    end: moment('2023-10-13T11:00:00').toDate(),
    data: {
      session: {
        id: 2,
        status: 'P',
        location: 'Asdfa',
        resource: 'Dr Alex',
        address: 'Building 5\nStreet 44\nNear Express Highway\nNew York',
      },
    },
    // isDraggable: true,
  },
  {
    start: moment('2023-10-14T12:00:00').toDate(),
    end: moment('2023-10-14T13:00:00').toDate(),
    data: {
      session: {
        id: 3,
        status: 'CI',
        location: 'Washington',
        resource: 'Dr David',
        address: 'Block 1\nSStreet 32\nLong Island\nNew York',
      },
    },
    // isDraggable: false,
  },
];

export default function BasicCalendar(props: CustomCalendarProps) {
  const [events, setEvents] = useState(EVENTS);

  const components = {
    event: ({ event }) => {
      const data = event?.data;
      if (data?.session) return <SessionEvent session={data?.session} />;

      return null;
    },
  };

  const onChangeEventTime = useCallback(
    (start: Date, end: Date, sessionId: number | undefined) => {
      setEvents((prevEvents) => {
        return [
          ...EVENTS.map((event) =>
            event?.data?.session?.id === sessionId
              ? {
                  ...event,
                  start: moment(start)?.toDate(),
                  end: moment(end)?.toDate(),
                }
              : event,
          ),
        ];
      });
    },
    [],
  );
  console.log('events', events);

  return (
    <DnDCalendar
      components={components}
      step={15}
      timeslots={4}
      resizable
      onEventDrop={({ start, end, event }) => {
        onChangeEventTime(start, end, event?.data?.session?.id);
      }}
      onEventResize={({ start, end, event }) => {
        onChangeEventTime(start, end, event?.data?.session?.id);
      }}
      events={events}
      min={moment('2023-10-13T08:00:00').toDate()}
      {...props}
    />
  );
}
