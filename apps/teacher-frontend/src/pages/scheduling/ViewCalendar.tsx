import { Fragment } from 'react';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid';
import { Menu, Transition } from '@headlessui/react';
import { useState, useEffect } from 'react';
import AddEventModal from './AddEventModal';
import UpdateEventModal from './UpdateEventModal';

function generate42Days(year, month) {
  // Adjust for Singapore Time (SGT, UTC+8)
  const SGT_OFFSET = 8 * 60 * 60000; // 8 hours in milliseconds

  // Get the first day of the given month in SGT
  const startOfMonth = new Date(year, month, 1);
  startOfMonth.setTime(startOfMonth.getTime() + SGT_OFFSET);

  // Determine the day of the week for the start of the month using getDay()
  let dayOfWeek = startOfMonth.getDay();

  // Adjust for Monday as the first day of the week
  if (dayOfWeek === 0) {
    // If it's Sunday
    dayOfWeek = 6;
  } else {
    dayOfWeek--;
  }

  // Determine how many days from the previous month need to be included based on the day of the week
  const previousMonthDaysCount = dayOfWeek;

  // Adjust the starting date back by that many days
  startOfMonth.setDate(startOfMonth.getDate() - previousMonthDaysCount);

  // Collect 42 days starting from the adjusted start date
  const days = [];
  for (let i = 0; i < 42; i++) {
    const currentDay = new Date(startOfMonth);
    currentDay.setDate(currentDay.getDate() + i);
    currentDay.setTime(currentDay.getTime() + SGT_OFFSET); // Adjust for SGT

    const today = new Date();
    today.setTime(today.getTime() + SGT_OFFSET); // Adjust for SGT

    days.push({
      date: currentDay.toISOString().split('T')[0], // Extract the YYYY-MM-DD format
      isCurrentMonth: currentDay.getMonth() === month,
      events: [],
      isSelected: false,
      isToday:
        currentDay.getDate() === today.getDate() &&
        currentDay.getMonth() === today.getMonth() &&
        currentDay.getFullYear() === today.getFullYear(),
    });
  }

  return days;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ViewCalendar() {
  // Initialize state for currentYear, currentMonth, and days
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [days, setDays] = useState(generate42Days(currentYear, currentMonth));

  // Regenerate days whenever the month/year changes
  useEffect(() => {
    setDays(generate42Days(currentYear, currentMonth));
  }, [currentYear, currentMonth]);

  // Handler functions
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((prev) => prev - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((prev) => prev + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const [showAddEventModal, setShowAddEventModal] = useState(false);

  const handleAddEvent = ({ name, date, timeRange }) => {
    const inputDate = new Date(date);
    const sgtEventDate = new Date(inputDate.getTime() + 8 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const dayIndex = days.findIndex((day) => day.date === sgtEventDate);
    if (dayIndex !== -1) {
      const updatedDays = [...days];
      updatedDays[dayIndex].events.push({
        id: Date.now(),
        name: name,
        // href: '#',
        datetime: date,
        time: timeRange,
      });

      setDays(updatedDays);
    }
  };

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleUpdateEvent = (updatedEvent) => {
    console.log('days', days);
    console.log('updatedEvent', updatedEvent);
    const dayIndex = days.findIndex(
      (day) => day.date === updatedEvent.datetime,
    );
    console.log('dayIndex', dayIndex);
    const eventIndex = days[dayIndex].events.findIndex(
      (event) => event.id === updatedEvent.id,
    );

    console.log(eventIndex);

    console.log('eventIndex', eventIndex);

    const updatedDays = [...days];

    console.log('updatedDays', updatedDays);
    updatedDays[dayIndex].events[eventIndex] = updatedEvent;
    setDays(updatedDays);
  };

  const [selectedDay, setSelectedDay] = useState(null);

  const handleSelectDay = (selectedDay) => {
    console.log(selectedDay);

    // Create a new array of days with updated isSelected values
    const updatedDays = days.map((day) =>
      day.date === selectedDay.date
        ? { ...day, isSelected: true }
        : { ...day, isSelected: false },
    );

    // Update state with the new array
    setDays(updatedDays);
    setSelectedDay(selectedDay);
  };

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <time dateTime={`${currentYear}-${currentMonth + 1}`}>
            {new Date(currentYear, currentMonth).toLocaleString('default', {
              month: 'long',
            })}{' '}
            {currentYear}
          </time>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              onClick={goToPrevMonth}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
              onClick={goToNextMonth}
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <Menu as="div" className="relative">
              <Menu.Button
                type="button"
                className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Month view
                <ChevronDownIcon
                  className="-mr-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}
                        >
                          Day view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}
                        >
                          Week view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}
                        >
                          Month view
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm',
                          )}
                        >
                          Year view
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            <div className="ml-6 h-6 w-px bg-gray-300" />
            <button
              type="button"
              className="ml-6 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => setShowAddEventModal(true)}
            >
              Add event
            </button>
            <AddEventModal
              isOpen={showAddEventModal}
              onClose={() => setShowAddEventModal(false)}
              onAdd={handleAddEvent}
            />
            <UpdateEventModal
              isOpen={isUpdateModalOpen}
              onClose={() => setIsUpdateModalOpen(false)}
              onUpdate={handleUpdateEvent}
              eventData={selectedEvent}
            />
          </div>

          <Menu as="div" className="relative ml-6 md:hidden">
            <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setShowAddEventModal(true)}
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Create event
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Go to today
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Day view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Week view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Month view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Year view
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>
      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          <div className="bg-white py-2">
            M<span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className="bg-white py-2">
            W<span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className="bg-white py-2">
            F<span className="sr-only sm:not-sr-only">ri</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">at</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">un</span>
          </div>
        </div>
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {days.map((day) => (
              <div
                key={day.date}
                className={classNames(
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500',
                  'relative px-3 py-2 min-h-[100px]',
                )}
              >
                <time
                  dateTime={day.date}
                  className={
                    day.isToday
                      ? 'flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white'
                      : undefined
                  }
                >
                  {day.date.split('-').pop().replace(/^0/, '')}
                </time>
                {day.events.length > 0 && (
                  <ol className="mt-2">
                    {day.events.slice(0, 2).map((event) => (
                      <li key={event.id}>
                        <a href={event.href} className="group flex">
                          <p
                            className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsUpdateModalOpen(true);
                            }}
                          >
                            {event.name}
                          </p>
                          <time
                            dateTime={event.datetime}
                            className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                          >
                            {event.time}
                          </time>
                        </a>
                      </li>
                    ))}
                    {day.events.length > 2 && (
                      <li className="text-gray-500">
                        + {day.events.length - 2} more
                      </li>
                    )}
                  </ol>
                )}
              </div>
            ))}
          </div>
          <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
            {days.map((day) => (
              <button
                key={day.date}
                type="button"
                onClick={() => handleSelectDay(day)}
                className={classNames(
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  (day.isSelected || day.isToday) && 'font-semibold',
                  day.isSelected && 'text-white',
                  !day.isSelected && day.isToday && 'text-indigo-600',
                  !day.isSelected &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    'text-gray-900',
                  !day.isSelected &&
                    !day.isCurrentMonth &&
                    !day.isToday &&
                    'text-gray-500',
                  'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10',
                )}
              >
                <time
                  dateTime={day.date}
                  className={classNames(
                    day.isSelected &&
                      'flex h-6 w-6 items-center justify-center rounded-full',
                    day.isSelected && day.isToday && 'bg-indigo-600',
                    day.isSelected && !day.isToday && 'bg-gray-900',
                    'ml-auto',
                  )}
                >
                  {day.date.split('-').pop().replace(/^0/, '')}
                </time>
                <span className="sr-only">{day.events.length} events</span>
                {day.events.length > 0 && (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    {day.events.map((event) => (
                      <span
                        key={event.id}
                        className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"
                      />
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {selectedDay?.events.length > 0 && (
        <div className="px-4 py-10 sm:px-6 lg:hidden">
          <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
            {selectedDay.events.map((event) => (
              <li
                key={event.id}
                className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50"
              >
                <div className="flex-auto">
                  <p className="font-semibold text-gray-900">{event.name}</p>
                  <time
                    dateTime={event.datetime}
                    className="mt-2 flex items-center text-gray-700"
                  >
                    <ClockIcon
                      className="mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    {event.time}
                  </time>
                </div>
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsUpdateModalOpen(true);
                  }}
                  className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100"
                >
                  Edit<span className="sr-only">, {event.name}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
