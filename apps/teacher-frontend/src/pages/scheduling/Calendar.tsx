import { Fragment, useEffect, useRef, useState } from 'react';
import MonthView from './MonthView';
import DayView from './DayView';
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

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState('day');
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
    const dayIndex = days.findIndex(
      (day) => day.date === updatedEvent.datetime,
    );

    const eventIndex = days[dayIndex].events.findIndex(
      (event) => event.id === updatedEvent.id,
    );

    const updatedDays = [...days];

    updatedDays[dayIndex].events[eventIndex] = updatedEvent;
    setDays(updatedDays);
  };

  const handleSelectDay = (selectedDay) => {
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
    <div className="flex h-full flex-col">
      test
      {viewMode === 'month' ? (
        <>
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
          <MonthView
            days={days}
            handleSelectDay={handleSelectDay}
            selectedDay={selectedDay}
            currentYear={currentYear}
            currentMonth={currentMonth}
            goToPrevMonth={goToPrevMonth}
            goToNextMonth={goToNextMonth}
            setShowAddEventModal={setShowAddEventModal}
            setIsUpdateModalOpen={setIsUpdateModalOpen}
            setSelectedEvent={setSelectedEvent}
          />
        </>
      ) : (
        <DayView
          days={days}
          selectedDay={selectedDay}
          currentYear={currentYear}
          currentMonth={currentMonth}
          goToPrevMonth={goToPrevMonth}
          goToNextMonth={goToNextMonth}
          setShowAddEventModal={setShowAddEventModal}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
          setSelectedEvent={setSelectedEvent}
        />
      )}
    </div>
  );
}
